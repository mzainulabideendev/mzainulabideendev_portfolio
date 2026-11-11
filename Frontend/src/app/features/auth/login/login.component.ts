import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';
import { shake } from '@shared/animations/shared.animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="login-page">
      <div class="login-card glass-card" [@shake]="shakeState()">
        <div class="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access admin features</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <div class="input-wrapper">
              <input type="text" formControlName="username" id="loginUsername" placeholder=" " />
              <label for="loginUsername">Username</label>
              <div class="input-line"></div>
            </div>
          </div>

          <div class="form-group">
            <div class="input-wrapper">
              <input type="password" formControlName="password" id="loginPassword" placeholder=" " />
              <label for="loginPassword">Password</label>
              <div class="input-line"></div>
            </div>
          </div>

          <button type="submit" class="btn btn--primary btn--full" [disabled]="submitting()">
            <span *ngIf="!submitting()">Sign In</span>
            <span *ngIf="submitting()" class="spinner"></span>
          </button>
        </form>

        <a routerLink="/" class="back-link">
          <i class="fas fa-arrow-left"></i> Back to Portfolio
        </a>
      </div>
    </section>
  `,
  styleUrls: ['./login.component.scss'],
  animations: [shake]
})
export class LoginComponent {
  readonly submitting = signal(false);
  readonly shakeState = signal<'idle' | 'shaking'>('idle');
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.triggerShake();
      return;
    }

    if (this.submitting()) return;
    this.submitting.set(true);
    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        this.submitting.set(false);
        if (res) {
          this.toast.show('Logged in successfully!', 'success');
          this.router.navigate(['/admin/bio']);
        } else {
          this.toast.show('Invalid credentials.', 'error');
          this.triggerShake();
        }
      },
      error: () => {
        this.submitting.set(false);
        this.triggerShake();
      }
    });
  }

  private triggerShake(): void {
    this.shakeState.set('shaking');
    setTimeout(() => this.shakeState.set('idle'), 500);
  }
}
