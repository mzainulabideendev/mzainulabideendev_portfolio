import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';

/** Fade up from below */
export const fadeUp = trigger('fadeUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(40px)' }),
    animate('600ms cubic-bezier(0.35,0,0.25,1)', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

/** Fade in */
export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('500ms ease-in', style({ opacity: 1 }))
  ])
]);

/** Stagger children */
export const staggerFadeUp = trigger('staggerFadeUp', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(30px)' }),
      stagger('80ms', [
        animate('500ms cubic-bezier(0.35,0,0.25,1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

/** Scale in */
export const scaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate('400ms cubic-bezier(0.35,0,0.25,1)', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

/** Slide in from left */
export const slideInLeft = trigger('slideInLeft', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-60px)' }),
    animate('500ms cubic-bezier(0.35,0,0.25,1)', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

/** Shake animation for error */
export const shake = trigger('shake', [
  state('idle', style({ transform: 'translateX(0)' })),
  state('shaking', style({ transform: 'translateX(0)' })),
  transition('idle => shaking', [
    animate('80ms', style({ transform: 'translateX(-10px)' })),
    animate('80ms', style({ transform: 'translateX(10px)' })),
    animate('80ms', style({ transform: 'translateX(-8px)' })),
    animate('80ms', style({ transform: 'translateX(8px)' })),
    animate('80ms', style({ transform: 'translateX(0)' }))
  ])
]);
