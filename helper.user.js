// ==UserScript==
// @name SEUGPAHelper
// @description 帮助你快速计算绩点
// @version 0.0.2
// @match *://ehall.seu.edu.cn/jwapp/sys/cjcx/*
// @run-at document-end
// ==/UserScript==
(function () {
    'use strict';
    function loadMyScript() {
        if (document.querySelector('.bh-advancedQuery-totalNum') === null || document.querySelector('.bh-advancedQuery-totalNum').firstChild === null) { setTimeout(loadMyScript, 500); }
        else {
            //alert('使用方法: 本插件只能计算已有的所有课程绩点（两学期或全部），若想要计算所有课程绩点，请选择务必全部，并务必在右下角选择每页显示100。\n\n使用技巧：在上一步基础上，使用高级搜索，筛选掉所有任选课程，避免课程数超出100导致无法计算。\n\n本插件不计算绩点的课程有军训、中西哲学智慧、中国戏曲艺术、吴健雄学院CPP课，所有任选课，所有通过/不通过课程')
            function getGrade(grade) {
                if (grade === '优') return 95;
                if (grade === '良') return 85;
                if (grade === '中') return 75;
                if (grade === '合格') return 65;
                if (grade === '不合格') return 59;
                else return parseFloat(grade);
            }
            function getGPA(grade) {
                if (grade <= 100 && grade >= 96) return 4.8;
                if (grade >= 93) return 4.5;
                if (grade >= 90) return 4.0;
                if (grade >= 86) return 3.8;
                if (grade >= 83) return 3.5;
                if (grade >= 80) return 3.0;
                if (grade >= 76) return 2.8;
                if (grade >= 73) return 2.5;
                if (grade >= 70) return 2.0;
                if (grade >= 66) return 1.8;
                if (grade >= 63) return 1.5;
                if (grade >= 60) return 1.0;
                else return 0;
            }
            function judgeLesson(lesson) {
                if(lesson == null) throw ("Wrong lesson @ judgeLesson");
                let lessonName = lesson.children[2].firstChild.innerHTML;
                let lessonFlag = lesson.children[6].firstChild.innerHTML;
                let lessonCode = lesson.children[3].firstChild.innerHTML;
                let lessonNotAllowed = ['军训', '中国戏曲艺术', '中西哲学智慧', '算法与程序设计'];
                //if (lessonFlag === '任选') return false;
                if (lessonNotAllowed.indexOf(lessonName) !== -1) return false;
                if (lessonCode.substring(0,3) === 'B00') return false;//任选课
                return true;
            }
            function isSelective(lesson) {// TODO
                if(lesson == null) throw ("Wrong lesson @ isSelective");
                let lessonName = lesson.children[2].firstChild.innerHTML;
                let lessonFlag = lesson.children[6].firstChild.innerHTML;
                if (lessonFlag === '任选') return true;
                return false;
            }
            function calclulate() {
                let totalNum = parseInt(document.querySelector('.bh-advancedQuery-totalNum').firstChild.innerHTML);
                let calclulatedNum = 0;
                let totalGPA = 0;
                let AVGgpa = 0;
                let AVGgpaAbroad = 0;
                let totalGrade = 0;
                let AVGgrade = 0;
                let totalCredits = 0;

                let calclulatedNumAbroad = 0;
                let UnweightedAVGgrade = 0;
                let totalGPAAbroad = 0;
                let totalCreditsAbroad = 0;
                let totalUnweightedGrade = 0;
                let AllLessons;
                if (document.querySelector('#contentqb-index-table') !== null) {
                    AllLessons = document.querySelector('#contentqb-index-table').children[1].firstChild.firstChild.children[1].children;
                    console.log("document.querySelector('#contentqb-index-table') !== null \n");
                }
                else {
                    AllLessons = document.querySelector('#contentdqxq-index-table').children[1].firstChild.firstChild.children[1].children;
                }
                for (let i = 0; i < totalNum; i++) {
                    console.log(i+" \n");
                    if (judgeLesson(AllLessons[i]) && AllLessons[i].children[9].innerHTML !== '通过' && AllLessons[i].children[9].innerHTML !== '不通过') {
                        let credit = parseFloat(AllLessons[i].children[7].firstChild.innerHTML);
                        let grade = getGrade(AllLessons[i].children[9].innerHTML);
                        let gpa = getGPA(grade);

                        calclulatedNumAbroad++;
                        totalUnweightedGrade += grade;
                        totalCreditsAbroad += credit;
                        totalGPAAbroad += gpa * credit;

                        if(!isSelective(AllLessons[i])){
                            calclulatedNum++;
                            totalGPA += gpa * credit;
                            totalGrade += grade * credit;
                            totalCredits += credit;
                        }
                    }
                }
                AVGgrade = (totalGrade / totalCredits).toFixed(5);
                AVGgpa = (totalGPA / totalCredits).toFixed(5);

                UnweightedAVGgrade = (totalUnweightedGrade / calclulatedNumAbroad).toFixed(5);
                AVGgpaAbroad = (totalGPAAbroad / totalCreditsAbroad).toFixed(5);
                //alert(`共查询到 ${totalNum}门课程\n计算了 ${calclulatedNum}门课程\n已获总学分为 ${totalCredits}\n百分制均分为 ${AVGgrade}\n4.8制度绩点为 ${AVGgpa}`);
                let gpaText = document.createElement('div');
                let result = `共查询到 ${totalNum}门课程,   计算了 ${calclulatedNum}门课程,   已获总学分为 ${totalCredits},   百分制均分为 ${AVGgrade},   4.8制度绩点为 ${AVGgpa}。\n 出国党：计算了 ${calclulatedNumAbroad}门课程,  已获总学分为 ${totalCreditsAbroad}，   算数均分为 ${UnweightedAVGgrade}，   4.8制绩点为 ${AVGgpaAbroad}`;
                gpaText.appendChild(document.createTextNode(result));
                if (document.querySelector('.jqx-tabs-title-container').children.length == 3) { document.querySelector('.jqx-tabs-title-container').appendChild(gpaText); }
                else {document.querySelector('.jqx-tabs-title-container').children[3].innerHTML=result}

                gpaText.setAttribute('overflow-x', 'scroll');
            }
            let calcBtn = document.createElement('button');
            calcBtn.appendChild(document.createTextNode("计算绩点"));
            calcBtn.onclick = calclulate;
            document.querySelector('.jqx-tabs-title-container').appendChild(calcBtn);

        }
    }
    loadMyScript();
})();
