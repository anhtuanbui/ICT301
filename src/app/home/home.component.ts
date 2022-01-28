// using swiper js
// documentation https://swiperjs.com/angular

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

import SwiperCore, {
  Swiper,
  Virtual,
  Pagination,
  Autoplay,
  Controller,
  Scrollbar,
  Navigation,
  Lazy,
} from 'swiper';
import { AutoplayOptions } from 'swiper/types';

SwiperCore.use([
  Virtual,
  Navigation,
  Pagination,
  Controller,
  Autoplay,
  Scrollbar,
  Lazy,
]);

const SLIDER_TIMEOUT = 3000;
@Component({
  selector: 'bnv-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  @ViewChild('sliderRef') sliderRef?: ElementRef<HTMLElement>;

  slider?: KeenSliderInstance;

  currentSlide: number = 1;
  dotHelper: Array<Number> = [];


  cards: string[] = [
    'Translating services',
    'Our commitment to your safety and wellbeing. ',
    'Your right and responsibilities',
    'Our Commitment to LGBTQI+ community ',
    'Our Commitment to Aboriginal and Torres Strait Islander Peoples',
    'Feedback and complaints',
  ];

  constructor() {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.slider = new KeenSlider(
        this.sliderRef!.nativeElement,
        {
          initial: this.currentSlide,
          slideChanged: (s) => {
            this.currentSlide = s.track.details.rel;
          },
          loop: true,
          mode: 'free-snap',
          slides: {
            perView: 3,
            spacing: 15,
          },
        },
        [
          (slider) => {
            let timeout: any;
            let mouseOver = false;
            function clearNextTimeout() {
              clearTimeout(timeout);
            }
            function nextTimeout() {
              clearTimeout(timeout);
              if (mouseOver) return;
              timeout = setTimeout(() => {
                slider.next();
              }, SLIDER_TIMEOUT);
            }
            slider.on('created', () => {
              slider.container.addEventListener('mouseover', () => {
                mouseOver = true;
                clearNextTimeout();
              });
              slider.container.addEventListener('mouseout', () => {
                mouseOver = false;
                nextTimeout();
              });
              nextTimeout();
            });
            slider.on('dragStarted', clearNextTimeout);
            slider.on('animationEnded', nextTimeout);
            slider.on('updated', nextTimeout);
          },
        ]
      );
      this.dotHelper = [
        ...Array(this.slider.track.details.slides.length).keys(),
      ];
    });
  }

  ngOnInit(): void {
    this.addMatchHeight();
  }

  ngOnDestroy(): void {
    this.removeMatchHeight();
    if (this.slider) this.slider.destroy();
  }

  addMatchHeight() {
    window.addEventListener('resize', () => {
      this.cardHeightCalc();
    });
  }

  removeMatchHeight() {
    window.removeEventListener('resize', () => {
      this.cardHeightCalc();
    });
  }

  cardHeightCalc() {
    const cards = document.querySelectorAll<HTMLElement>('.grid-card');
    cards.forEach((item) => {
      let height = (item.offsetWidth * 320) / 420;
      item.style.height = height + 'px';
    });
  }
}
