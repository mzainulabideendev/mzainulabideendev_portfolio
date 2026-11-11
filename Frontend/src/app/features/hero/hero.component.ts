import {
  Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MagneticDirective } from '@shared/directives/magnetic.directive';
import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, MagneticDirective],
  template: `
    <section id="hero" class="hero">
      <canvas #particleCanvas class="hero__canvas"></canvas>
      <div class="hero__overlay"></div>

      <div class="hero__content">
        <p class="hero__greeting" id="heroGreeting">Hello, I'm</p>
        <h1 class="hero__name" id="heroName">
          <span class="typing-text">{{ displayedName }}</span>
          <span class="cursor">|</span>
        </h1>
        <p class="hero__subtitle" id="heroSubtitle">Full-Stack Developer &amp; Creative Thinker</p>

        <div class="hero__socials" id="heroSocials">
          <a href="#" class="social-icon" target="_blank" aria-label="GitHub">
            <i class="fab fa-github"></i>
          </a>
          <a href="#" class="social-icon" target="_blank" aria-label="LinkedIn">
            <i class="fab fa-linkedin-in"></i>
          </a>
          <a href="#" class="social-icon" target="_blank" aria-label="Twitter">
            <i class="fab fa-x-twitter"></i>
          </a>
        </div>

        <div class="hero__actions" id="heroActions">
          <a (click)="scrollTo('projects')" class="btn btn--primary" appMagnetic>
            View My Work
          </a>
          <a href="https://i.postimg.cc/25dbkXCc/M-Zain-Ul-Abideen-cv.png" target="_blank" rel="noopener"
             class="btn btn--outline" appMagnetic>
            Download Resume
          </a>
          <a (click)="scrollTo('contact')" class="btn btn--outline" appMagnetic>
            Get In Touch
          </a>
        </div>
      </div>

      <div class="hero__scroll-hint">
        <div class="mouse">
          <div class="mouse__wheel"></div>
        </div>
        <p>Scroll Down</p>
      </div>
    </section>
  `,
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  displayedName = '';
  private fullName = 'Muhammad Zain Ul Abideen';
  private typingInterval: ReturnType<typeof setInterval> | null = null;
  private animationFrameId = 0;
  private particles: Particle[] = [];
  private ctx!: CanvasRenderingContext2D;

  ngOnInit(): void {
    this.startTyping();
  }

  ngAfterViewInit(): void {
    this.initParticles();
    this.animateHeroElements();
  }

  ngOnDestroy(): void {
    if (this.typingInterval) clearInterval(this.typingInterval);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  private startTyping(): void {
    let i = 0;
    this.typingInterval = setInterval(() => {
      if (i < this.fullName.length) {
        this.displayedName += this.fullName.charAt(i);
        i++;
      } else {
        if (this.typingInterval) clearInterval(this.typingInterval);
      }
    }, 100);
  }

  private animateHeroElements(): void {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('#heroGreeting', { y: 30, opacity: 0, duration: 0.8, delay: 0.3 })
      .from('#heroName', { y: 40, opacity: 0, duration: 0.8 }, '-=0.4')
      .from('#heroSubtitle', { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
      .from('#heroSocials', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
      .from('#heroActions', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3');
  }

  /* ───── Canvas Particle System ───── */
  private initParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas(canvas);

    window.addEventListener('resize', () => this.resizeCanvas(canvas));

    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    this.animateParticles(canvas);
  }

  private resizeCanvas(canvas: HTMLCanvasElement): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private animateParticles(canvas: HTMLCanvasElement): void {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(108, 99, 255, ${p.opacity})`;
      this.ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(108, 99, 255, ${0.1 * (1 - dist / 120)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animateParticles(canvas));
  }
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  opacity: number;
}
