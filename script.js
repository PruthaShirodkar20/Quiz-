// Main Controller
// Module Pattern
var controller =(function(){
     function questionConstructor(questionid, question, options, answer ){
         this.questionID=questionid,
         this.question=question,
         this.options=options;
         this.answer=answer  
     }
     
    var questionLocalStorage={
        setquestionCollection:function(collection){
            localStorage.setItem('questionCollection',JSON.stringify(collection));
        },        
        getquestionCollection:function(){
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removequestionCollection:function(){
            localStorage.removeItem('questionCollection');
        }
    };
    if(questionLocalStorage.getquestionCollection() === null){
                 questionLocalStorage.setquestionCollection([]);
    }
    
    var progress={
        questionIndex: 0
    };
    
    function Person(id, firstName, lastName, score){
        this.id=id;
        this.firstName=firstName;
        this.lastName=lastName;
        this.score=score;
    }
    var currPersonData={
        fullName:[],
        score:0
    }
    
    var adminFullName=['John', 'Smith'];
    var personLocalStorage={
        setPersonData: function(newPersonData){
            localStorage.setItem('personData',JSON.stringify(newPersonData));
        },
        
        getPersonData:function(){
            return JSON.parse(localStorage.getItem('personData'));
        },
        
        removePersonData:function(){
            localStorage.removeItem('personData');
        }
        
    };
    
    if(personLocalStorage.getPersonData() ===null){
        personLocalStorage.setPersonData([]);
    }
     return{
         getCurrentPersonData:currPersonData,
         getadminFullName: adminFullName,
         getPersonLocalStorage: personLocalStorage,
         addPerson:function(){
           var newPerson, personID;
             if(personLocalStorage.getPersonData().length >0){
                 personID=personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length-1].id+1;
             }else{
                 personID=0;
             }
             
             newPerson=new Person(personID,currPersonData.fullName[0], currPersonData.fullName[1], currPersonData.score);
             personData=personLocalStorage.getPersonData();
             personData.push(newPerson);
             personLocalStorage.setPersonData(personData);
             console.log(newPerson);
         },
         isFinished:function(){
           return progress.questionIndex  
         },
         checkanswer: function(answer){
             if(questionLocalStorage.getquestionCollection()[progress.questionIndex].answer === answer.textContent){
                 currPersonData.score++;
             }
             else{
                 return false;
             }
         },
         getquestion:questionLocalStorage,
         
         getprogress:progress,
         
         addquestion: function(question, opts){
             var getStoredquestions;
             var questionId, questionObj;
             var correctans;
             var flg=false;
             var options1;
             if(questionLocalStorage.getquestionCollection() === null){
                 questionLocalStorage.setquestionCollection([]);
             }
             options1=[];

             for(var i=0;i<opts.length;i++){
                 if(opts[i].value !== ""){
                     options1.push(opts[i].value);
                 }
                 if(opts[i].previousElementSibling.checked && opts[i].value!== "")
                     {
                         correctans=opts[i].value;
                         flg=true;
                     }
             }
             if(questionLocalStorage.getquestionCollection().length >0){
                     questionId=questionLocalStorage.getquestionCollection()[questionLocalStorage.getquestionCollection().length-1].questionID+1;
             }
             else{
                 questionId=1;}
             
             questionObj= new questionConstructor(questionId, question.value, options1, correctans);
             
             if(question.value !== "" && options1.length>1 && flg===true){
                 
             getStoredquestions=questionLocalStorage.getquestionCollection();
             getStoredquestions.push(questionObj);                 
             questionLocalStorage.setquestionCollection(getStoredquestions);
             question.value="";
             for(var j=0;j<opts.length;j++)
                 {
                     opts[j].value=" ";
                     opts[j].previousElementSibling.checked=false;
                 }
             }
             else{
                 alert('Question not provided or atleast two options not provided....');
             }
         }
     }
    })();

// GUI Controller
var GUIController= (function(){
    // object of DOM elements
    var domItems={
        adminPanelSection:document.querySelector('.admin-panel-container'),
        insertquestionButtonDom:document.getElementById('question-insert-btn'),
        newquestionTextDom:document.getElementById('new-question-text'),
        optionsDom:document.querySelectorAll('.admin-option'),
        optionsContainer:document.querySelector('.admin-options-container'),
        quizContainer:document.querySelector('.quiz-container'),
        questionWrapper:document.querySelector('.inserted-questions-wrapper'),
        questionUpdate:document.getElementById('question-update-btn'),
        questionDelete:document.getElementById('question-delete-btn'),
        questionClearList:document.getElementById('questions-clear-btn'),
        resultsListWrapper:document.querySelector('.results-list-wrapper'),
        clearResultsBtn:document.getElementById('results-clear-btn'),
        // question list screen
        questionSection:document.querySelector('.quiz-container'),
        questionDisplayList:document.getElementById('asked-question-text'),
        questionOptionList:document.querySelector('.quiz-options-wrapper'),
        progressBar: document.querySelector('progress'),
        progressPara:document.getElementById('progress'),
        answerContainer:document.querySelector('.instant-answer-container'),
        answerWrapper:document.getElementById('instant-answer-wrapper'),
        answerText:document.getElementById('instant-answer-text'),
        emoticonDisplay: document.getElementById('emotion'),
        nextButton:document.getElementById('next-question-btn'),
        
        //landing page screen
        startTestButton:document.getElementById('start-quiz-btn'),
        firstNameInput:document.getElementById('firstname'),
        lastNameInput:document.getElementById('lastname'),
        landingPageSection:document.querySelector('.landing-page-container'),
        
        //final page
        finalResultDisplay:document.getElementById('final-score-text'),
        finalResultSection:document.querySelector('.final-result-container')
    };     
    return{
        
           resetDesign:function(){
               domItems.questionOptionList.style="";
               domItems.answerContainer.style="opacity:0";
           },
        
           finalResult: function(currentPerson){
               domItems.finalResultDisplay.textContent=currentPerson.fullName[0]+' '+currentPerson.fullName[1] +' finished the test with a score of '+currentPerson.score;
               domItems.questionSection.style.display='none';
               domItems.finalResultSection.style.display='block';
           },
         
           addResultOnPanel: function(userData){
               var resultHTML;
               domItems.resultsListWrapper.innerHTML='';
               if(userData.getPersonData() !== null){
               for(var i=0;i<userData.getPersonData().length;i++){
                   console.log("***"+userData.getPersonData()[i].id);
                    resultHTML='<p class="person person-'+i+'"><span class="person-'+i+'">'+userData.getPersonData()[i].firstName+' '+userData.getPersonData()[i].lastName+' - '+ userData.getPersonData()[i].score+' points</span><button id="delete-result-btn_' +userData.getPersonData()[i].id+'"class="delete-result-btn">Delete</button></p>';
                   domItems.resultsListWrapper.insertAdjacentHTML('afterbegin', resultHTML);
               }
               }
           },
           
           getFullName:function(currentPerson, storagequestionlist, admin){
               
               if(!domItems.firstNameInput.value!=="" && domItems.lastNameInput.value!=""){
               if(!(domItems.firstNameInput.value=== admin[0] && domItems.lastNameInput.value=== admin[1])){
               if(storagequestionlist.getquestionCollection().length >0){
               currentPerson.fullName.push(domItems.firstNameInput.value);
               currentPerson.fullName.push(domItems.lastNameInput.value);
               
               domItems.landingPageSection.style.display="none";
               domItems.questionSection.style.display="block";
               }else{
                   alert("questions not ready");
               }
               }
               else{
                   domItems.landingPageSection.style.display="none";
                   domItems.adminPanelSection.style.display="block";
               }
               }else{
                   alert("Please enter the first and last name");
               }
               
           },
           getquestion: domItems,
        
           designanswerBanner: function(answer, resultIndicator){
               
            if(resultIndicator){
                   index=1;                   
               }
               else{
                   index=0;
               }
               options={
                   
                   answerText:['This is the correct answer','This is the wrong answer'],
                   colorText:['green','red'],
                   emoticonDisplay:['images/happy.png','images/sad.png']
               }
               domItems.questionOptionList.style="opacity:0.6; pointer-events:none";
               domItems.answerContainer.style="opacity:1";
               domItems.answerText.textContent=options.answerText[index];
               domItems.answerWrapper.className=options.colorText[index];
               domItems.emoticonDisplay.setAttribute('src',options.emoticonDisplay[index]);
              
               
               
           },
           addInputDynamically: function(){
               var addchildElement=function(){
                   var inputHTML, s;
                   s=document.querySelectorAll('.admin-option').length;
                   inputHTML='<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+s+ '"name="answer" value="'+s+'">         <input type="text" class="admin-option admin-option-'+s+'" value=""></div>';
                   domItems.optionsContainer.insertAdjacentHTML('beforeend',inputHTML);
                   domItems.optionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus',addchildElement);
                   domItems.optionsContainer.lastElementChild.lastElementChild.addEventListener('focus',addchildElement);
               }
               
               domItems.optionsContainer.lastElementChild.lastElementChild.addEventListener('focus',addchildElement);               
           },
           
            
           createList:function(dt){
           var numbering,inputHTML;
           domItems.questionWrapper.innerHTML="";
           numbering=[];
           if(dt.getquestionCollection() !== null){
           for(var i=0; i<dt.getquestionCollection().length;i++){
               numbering.push(i+1);
               inputHTML='<p><span>'+numbering[i]+'.'+dt.getquestionCollection()[i].question+'</span><button id="question-'+ dt.getquestionCollection()[i].questionID + '">EDIT</button></p>'; 
               domItems.questionWrapper.insertAdjacentHTML('afterbegin',inputHTML);
           }}
           },
        
        
          clearquestionlist:function(x, callCreateList){
                    console.log("hey");
                    x.removequestionCollection();
                    callCreateList(x);
            },
        
           
          displayquestionlist: function(x, p){
            
            var insertNewOptions, optionsTag;
            optionsTag=['1','2','3','4','5'];
              
            if(x.getquestionCollection().length >0){
                domItems.questionDisplayList.textContent= x.getquestionCollection()[p.questionIndex].question;   
                let optCount=x.getquestionCollection()[p.questionIndex].options.length;
                domItems.questionOptionList.innerHTML='';
                for(let i=0;i< optCount;i++){
                    insertNewOptions='<div class="choice-'+i+'"><span class="choice-'+i+'">'+optionsTag[i]+'</span><p  class="choice-'+i+'">'+x.getquestionCollection()[p.questionIndex].options[i]+'</p></div>';
                    domItems.questionOptionList.insertAdjacentHTML('beforeend',insertNewOptions);
                }
            }
           },
        
          displayprogress: function(x, p){
              domItems.progressBar.max= x.getquestionCollection().length;
              domItems.progressBar.value=p.questionIndex +1;
              domItems.progressPara.textContent=(p.questionIndex +1) +'/'+(domItems.progressBar.max);
              
          },
           
           editquestion:function(event, x, addInputs, callCreateList){
               var qsId, itemFound, indexarr;
               var getStorageqsList=[];
               if('question-'.indexOf(event.target.questionID)){
                   qsId= parseInt(event.target.id.split('-')[1]);
                   getStorageqsList= x.getquestionCollection();
                   for(var i=0;i <getStorageqsList.length;i++){
                       if(getStorageqsList[i].questionID === qsId){
                           itemFound=getStorageqsList[i];
                           indexarr=i;
                       }      
                   }
                   
                   
                   domItems.newquestionTextDom.value=itemFound.question;
                   domItems.optionsContainer.innerHTML='';
                   optionsHTML='';
                   
                   for(let j=0;j<itemFound.options.length;j++){
                       optionsHTML+='<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+j+ '"name="answer" value="'+j+'"><input type="text" class="admin-option admin-option-'+j+'" value="'+itemFound.options[j]+'"></div>';
                   }
                   
                   domItems.optionsContainer.innerHTML=optionsHTML;
                   domItems.questionDelete.style.visibility='visible';
                   domItems.questionUpdate.style.visibility='visible';
                   domItems.insertquestionButtonDom.style.visibility='hidden';
                   addInputs();
                   domItems.questionClearList.style.pointerEvents='none';
                   
                   
            updatequestion =function(){
                       var newOptions=[];
                       var optionsEls=document.querySelectorAll(".admin-option");
                       itemFound.question=domItems.newquestionTextDom.value;
                       itemFound.answer='';
                       for(let i=0;i<optionsEls.length;i++){
                           if(optionsEls[i].value!== ''){
                               newOptions.push(optionsEls[i].value);
                               if(optionsEls[i].previousElementSibling.checked){
                                   itemFound.answer=optionsEls[i].value;
                               }
                           }
                       }
                       itemFound.options=newOptions;
                       if(itemFound.question !== '')
                       {
                           if(itemFound.options.length>1)
                               {
                                   if(itemFound.answer!== ''){
                                        getStorageqsList.splice(indexarr,1,itemFound);
                                        x.setquestionCollection(getStorageqsList);
                                       domItems.newquestionTextDom.value=' ';
                                       for(let i=0;i<optionsEls.length;i++){
                                           optionsEls[i].value='';
                                           optionsEls[i].previousElementSibling.checked=false;
                                       }
                                       domItems.questionDelete.style.visibility='hidden';
                                       domItems.questionUpdate.style.visibility='hidden';
                                       domItems.insertquestionButtonDom.style.visibility='visible';
                                       domItems.questionClearList.style.pointerEvents='';
                                       callCreateList(x);
                                   }
                                   else{
                                        alert('Enter answer');                                     
                                   }
                               }
                           else{
                               alert("Insert correct number of options");
                           }
                       }
                       else{
                           alert("Insert question");
                       }
                   }
                var deletequestion=function(){                
                var optionsEls=document.querySelectorAll(".admin-option");
                getStorageqsList.splice(indexarr,1);
                x.setquestionCollection(getStorageqsList);
                domItems.newquestionTextDom.value=' ';
                for(let i=0;i<optionsEls.length;i++){
                        optionsEls[i].value='';
                        optionsEls[i].previousElementSibling.checked=false;
                }
                domItems.questionDelete.style.visibility='hidden';
                domItems.questionUpdate.style.visibility='hidden';
                domItems.insertquestionButtonDom.style.visibility='visible';
                domItems.questionClearList.style.pointerEvents='';
                callCreateList(x);
            }
                

                   domItems.questionUpdate.addEventListener('click',updatequestion);              
                   domItems.questionDelete.addEventListener('click',deletequestion);
                }
               
           },
        deleteResult:function(event, userData){
            var getId, personarray;
            personarray=userData.getPersonData();
            if('delete-result-btn_'.indexOf(event.target.id)){
               getId=parseInt(event.target.id.split('_')[1]);
               for(var i=0; i<personarray.length;i++){
                   if(personarray[i].id===getId){
                       personarray.splice(i,1);
                       userData.setPersonData(personarray);
                   }
               }
               }
        },
        clearResultList:function(user){
            if(user.getPersonData().length >1){
            alert("You will lose all the data");
            user.removePersonData();
            }
        }
};
})();

//Mediator Controller for communication between Main and GUI controller
var mediatorController= (function(controller, GUIController){ 
    
    var getSelectedDom= GUIController.getquestion;
    GUIController.addInputDynamically();   
    GUIController.createList(controller.getquestion);
    
    getSelectedDom.insertquestionButtonDom.addEventListener('click',function(){
          var adminOptions=document.querySelectorAll('.admin-option');
          controller.addquestion(getSelectedDom.newquestionTextDom, adminOptions);
          GUIController.createList(controller.getquestion);
    })
    
    getSelectedDom.questionWrapper.addEventListener('click',function(e){
        GUIController.editquestion(e, controller.getquestion, GUIController.addInputDynamically, GUIController.createList);
        
    })
    
    getSelectedDom.questionClearList.addEventListener('click',function(e){
        GUIController.clearquestionlist(controller.getquestion, GUIController.createList);
    });
    
    GUIController.displayquestionlist(controller.getquestion, controller.getprogress);
    GUIController.displayprogress(controller.getquestion, controller.getprogress);
    
    
    getSelectedDom.questionOptionList.addEventListener('click', function(e){
        
        var count=getSelectedDom.questionOptionList.querySelectorAll('div').length;
        for(let i=0;i<count;i++){
            if(e.target.className=== 'choice-'+i){
                var answer= document.querySelector('.quiz-options-wrapper div p.'+e.target.className);
                console.log(answer);
                var resultIndicator=controller.checkanswer(answer);
                GUIController.designanswerBanner(answer, resultIndicator);
                if(controller.isFinished()){
                    getSelectedDom.nextButton.textContent="FINISHED";
                }
                var nextquestion=function(questionData, progress){
                    if(controller.isFinished()){
                        controller.addPerson();
                        GUIController.finalResult(controller.getCurrentPersonData);
                    }
                    else{
                        GUIController.resetDesign();
                        controller.getprogress.questionIndex++;
                        GUIController.displayquestionlist(controller.getquestion, controller.getprogress)
                    }
                    
                }
                getSelectedDom.nextButton.onclick=function(){
                    nextquestion(controller.getquestion, controller.getprogress);
                }
            }
        }
    });
    
    getSelectedDom.startTestButton.addEventListener('click',function(){
       GUIController.getFullName(controller.getCurrentPersonData, controller.getquestion, controller.getadminFullName); 
    });
    
    getSelectedDom.lastNameInput.addEventListener('focus',function(){
        getSelectedDom.lastNameInput.addEventListener('keypress',function(e){
            if(e.keyCode===13){
                 GUIController.getFullName(controller.getCurrentPersonData, controller.getquestion, controller.getadminFullName); 
            }
        })
    })
    
    GUIController.addResultOnPanel(controller.getPersonLocalStorage);
    getSelectedDom.resultsListWrapper.addEventListener('click',function(event){
        GUIController.deleteResult(event, controller.getPersonLocalStorage);
        GUIController.addResultOnPanel(controller.getPersonLocalStorage);
    });
    
    getSelectedDom.clearResultsBtn.addEventListener('click',function(){
        GUIController.clearResultList(controller.getPersonLocalStorage);
        GUIController.addResultOnPanel(controller.getPersonLocalStorage);
    })
})(controller, GUIController);



