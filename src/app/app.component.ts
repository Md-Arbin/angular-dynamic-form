import { Component } from '@angular/core';
import registrationSchema from '../assets/registration.schema.json';
import feedbackSchema from '../assets/feedback.schema.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  schemas = [
    { name: 'Registration', schema: registrationSchema },
    { name: 'Feedback', schema: feedbackSchema }
  ];

  selected = this.schemas[0];
  lastSubmission: any = null;

  onSubmitted(val: any) {
    console.log('Form submitted:', val);
    this.lastSubmission = val;
  }
}
