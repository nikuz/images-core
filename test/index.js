
import Renderer from '../src';
import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
    const image = new Renderer({
        container: 'body',
        width: 600,
        height: 600,
        imageURL: '/graphics/001.jpeg',
        // text
        text: 'Specify the color of the box to write. For the general syntax of this option',
        textFontFamily: 'Kaushan',
        textEffect: 'append-lines', // type | fade lines | fade letters | slide lines | append lines | fade
        textAlign: 'right', // left | center | right
        textVerticalAlign: 'top', // top | center | bottom
        // author
        author: 'William Longgood',
        authorFontFamily: 'Lobster',
        authorEffect: 'fade', // type | slide | append | fade
        authorAlign: 'left', // left | center | right
        authorVerticalAlign: 'bottom', // top | center | bottom
        // common
        animate: false,
        frameQuality: 0.93,
        overlay: 'border', // solid | lines | border
        color: '#FFF',
    });
    image.render();

    const buttonRefresh = document.createElement('input');
    buttonRefresh.type = 'button';
    buttonRefresh.value = 'Refresh';
    buttonRefresh.className = 'refresh-button';
    buttonRefresh.onclick = () => {
        image.rerender();
    };
    document.body.appendChild(buttonRefresh);

    const buttonStop = document.createElement('input');
    buttonStop.type = 'button';
    buttonStop.value = 'Stop';
    buttonStop.className = 'refresh-button';
    buttonStop.onclick = () => {
        image.stop();
    };
    document.body.appendChild(buttonStop);
});
