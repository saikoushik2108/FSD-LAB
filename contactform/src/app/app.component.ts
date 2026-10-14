import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  form = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern('^[a-zA-Z ]+$')
    ]],

    email: ['', [
      Validators.required,
      Validators.email
    ]],

    phone: ['', [
      Validators.required,
      Validators.pattern('^[6-9][0-9]{9}$')
    ]],

    message: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(150)
    ]]
  });

  constructor(private fb: FormBuilder) {}

  send() {
    if (this.form.valid) {
      alert('Message sent successfully!');
      console.log(this.form.value);
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }
}