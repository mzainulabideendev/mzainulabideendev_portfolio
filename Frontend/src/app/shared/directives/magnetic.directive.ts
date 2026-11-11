import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMagnetic]',
  standalone: true
})
export class MagneticDirective {
  @Input() magneticStrength = 0.3;

  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    this.el.nativeElement.style.transform =
      `translate(${x * this.magneticStrength}px, ${y * this.magneticStrength}px)`;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.transform = 'translate(0, 0)';
    this.el.nativeElement.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.el.nativeElement.style.transition = 'none';
  }
}
