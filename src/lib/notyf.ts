"use client";
import { Notyf } from 'notyf';

let singleton: Notyf | null = null;

export function getNotyf() {
  if (!singleton) {
    singleton = new Notyf({
      duration: 2500,
      position: { x: 'right', y: 'bottom' },
      ripple: true,
      dismissible: true,
    });
  }
  return singleton;
}