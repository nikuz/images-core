
import Renderer from '../src';
import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
    const image = new Renderer({
        container: 'body',
        width: 600,
        height: 600,
        imageURL: '/graphics/001.jpg',
        // text
        text: 'There is no elevator to success, you have to take the stairs. There is no elevator to success, you have to take the stairs.',
        textFontFamily: 'Courgette',
        textEffect: 'append-lines', // type | fade-lines | fade-letters | slide-lines | append-lines | fade
        textAlign: 'right', // left | center | right
        textVerticalAlign: 'center', // top | center | bottom
        // author
        author: 'William Longgood',
        authorFontFamily: 'Lobster',
        authorEffect: 'fade', // type | slide | append | fade
        authorAlign: 'right', // left | center | right
        authorVerticalAlign: '', // stick | bottom
        // common
        animate: true,
        frameQuality: 0.93,
        overlay: 'solid', // solid | lines | border
        separator: 'line', // line | dash | dot
        color: '#FFF',
        debug: false,
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
