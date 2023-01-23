import { Component, OnInit } from '@angular/core';
import { interval, timeout } from 'rxjs';
import { QuestionserviceService } from '../service/questionservice.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit{
 public name:string="";
 public QuestionList:any=[];
 public currentQuestion:number=0;
 public points:number=0;
 currectAnswer:number=0;
 incorrectAnswer:number=0;
 counter=60;
 interval$:any;
 progress:string="0";
 isQuizCompleted:boolean=false;
 constructor(private serv:QuestionserviceService){}
  ngOnInit(): void {
    this.name=localStorage.getItem("name")!;
    this.getAllQuestion();
    this.startCounter();
    
  }
  getAllQuestion(){
 this.serv.getQuestionJson().subscribe(res=>{

 this.QuestionList=res.Question;
 })
  }

  nextQuestion(){
 this.currentQuestion++;
  }

  previusQuestion(){
 this.currentQuestion--
  }

  answer(currentQuestion:number,option:any){

    if(currentQuestion===this.QuestionList.length){
      this.isQuizCompleted=true;
      this.stopCounter();
    }
 if(option.correct){
  this.points+=10;
  this.currectAnswer++;
  setTimeout(() => {
    this.currentQuestion++;
    this.restartCounter();
    this.getProgressPersentege();
  }, 1000);
 
 }else{
  setTimeout(() => {
    this.currentQuestion++;
    this.incorrectAnswer++;
    this.restartCounter();
    this.getProgressPersentege();
  }, 1000);
  this.points-=10;
 
 }

  }

  startCounter(){
this.interval$=interval(1000).subscribe(val=>{
  this.counter--;
  if(this.counter===0){
  this.currentQuestion++;
  this.counter=60;
  this.points-=10;
  this.progress="0";
  }
});
setTimeout(()=>{
this.interval$.unsubscribe();
},6000000)
  }
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;
  }
  restartCounter(){
    this.stopCounter();
    this.counter=60;
    this.startCounter();
    this.progress="0";
  }
  resetQuiz(){
    this.restartCounter();
    this.getAllQuestion();
    this.points=0;
    this.counter=60;
    this.currentQuestion=0;
  }

  getProgressPersentege(){
    this.progress=((this.currentQuestion/this.QuestionList.length)*100).toString();
    return this.progress;
  }
}
