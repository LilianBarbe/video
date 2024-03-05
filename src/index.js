import './index.css';

import Player from '@vimeo/player';

class VimeoPlayers {
  constructor() {
    this.vimeoComponents = document.querySelectorAll('[data-vimeo-component]');
    this.init();
  }

  init() {
    this.vimeoComponents.forEach((vimeoComponent) => {
      const vimeoWrap = vimeoComponent.querySelector('[data-vimeo-url]');
      const vimeoID = vimeoWrap.getAttribute('data-vimeo-url');
      const vimeoPauseButton = vimeoComponent.querySelector('[data-vimeo-pause]');
      const vimeoPlayButton = vimeoComponent.querySelector('[data-vimeo-play]');
      const vimeoPlayButtonSecond = vimeoComponent.querySelector('[data-vimeo-play-second]');
      const vimeoSoundOn = vimeoComponent.querySelector('[data-vimeo-sound="on"]');
      const vimeoSoundOff = vimeoComponent.querySelector('[data-vimeo-sound="off"]');
      const vimeoRestartButton = vimeoComponent.querySelector('[data-vimeo-restart]');
      const vimeoOverlay = vimeoComponent.querySelector('[data-vimeo-overlay]');
      let muted = true;
      let onPlayRestart = true;
      let playing = false;
      let onRestartMakeSound = true;

      if (!onPlayRestart) {
        vimeoPlayButton.classList.add('hide');
      } else {
        vimeoPlayButtonSecond.classList.add('hide');
        vimeoPauseButton.classList.add('hide');
        vimeoRestartButton.classList.add('hide');
        vimeoSoundOn.classList.add('hide');
      }

      if (vimeoSoundOff) {
        vimeoSoundOff.classList.add('hide');
      }

      let isBackgroundVideo = vimeoWrap.getAttribute('data-vimeo-background') === 'true';
      const scale = vimeoWrap.getAttribute('data-vimeo-scale');
      const player = new Player(vimeoWrap, {
        background: isBackgroundVideo,
        playsinline: !isBackgroundVideo,
        url: vimeoID,
        width: vimeoWrap.offsetWidth,
      });

      // Après le chargement du lecteur
      player.on('loaded', function () {
        // Trouve l'iframe dans le wrapper
        let iframe = vimeoWrap.querySelector('iframe');
        iframe.style.transform = `translate(-50%, -50%) scale(${scale})`; //Ajuste la valeur scale en fonction de vos besoins
      });

      const videoRestart = function () {
        player.setCurrentTime(0);
        if (onRestartMakeSound) {
          videoUnmuted();
        } else {
          videoMuted();
        }
      };

      const videoGetPaused = function () {
        vimeoPauseButton.classList.toggle('hide');
        vimeoPlayButtonSecond.classList.remove('hide');
        vimeoOverlay.classList.remove('hide');
        player.pause();
      };

      const videoGetPlayed = function () {
        playing = true;
        vimeoPauseButton.classList.toggle('hide');
        vimeoPlayButton.classList.add('hide');
        vimeoPlayButtonSecond.classList.add('hide');
        vimeoOverlay.classList.add('hide');

        player.play();
        if (muted) {
          player.setVolume(0);
        }
        if (onPlayRestart) {
          vimeoRestartButton.classList.remove('hide');
          vimeoPlayButton.classList.add('hide');
          vimeoPlayButton.classList.add('hide');
          vimeoPauseButton.classList.remove('hide');
          muted = true;
          onPlayRestart = false;
          videoRestart();
        }
      };

      const videoUnmuted = function () {
        if (muted) {
          player.setVolume(1);
          vimeoSoundOn.classList.add('hide');
          vimeoSoundOff.classList.remove('hide');
          muted = false;
        } else {
          vimeoSoundOn.classList.add('hide');
          vimeoSoundOff.classList.remove('hide');
        }
      };

      const videoMuted = function () {
        muted = true;
        vimeoSoundOff.classList.toggle('hide');
        vimeoSoundOn.classList.toggle('hide');
        player.setVolume(0);
      };

      if (vimeoPauseButton && vimeoPlayButton) {
        vimeoPauseButton.addEventListener('click', videoGetPaused);
      }

      if (vimeoPauseButton && vimeoPlayButton) {
        vimeoPlayButton.addEventListener('click', videoGetPlayed);
        vimeoPlayButtonSecond.addEventListener('click', videoGetPlayed);
      }

      if (vimeoSoundOff && vimeoSoundOn) {
        vimeoSoundOn.addEventListener('click', videoUnmuted);
      }

      if (vimeoSoundOff && vimeoSoundOn) {
        vimeoSoundOff.addEventListener('click', videoMuted);
      }

      if (vimeoRestartButton) {
        vimeoRestartButton.addEventListener('click', videoRestart);
      }

      if (vimeoOverlay) {
        vimeoOverlay.addEventListener('click', videoGetPlayed);
      }
    });
  }
}
document.addEventListener('DOMContentLoaded', new VimeoPlayers());
