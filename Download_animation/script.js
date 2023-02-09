const $ = (s, o = document) => o.querySelector(s);
const $$ = (s, o = document) => o.querySelectorAll(s);

$$('.button').forEach(button => {

    let count = {
            number: 0
        },
        icon = $('.icon', button),
        iconDiv = $('.icon > div', button),
        arrow = $('.icon .arrow', button),
        countElem = $('span', button),
        svgPath = new Proxy({
            y: null,
            s: null,
            f: null,
            l: null
        }, {
            set(target, key, value) {
                target[key] = value;
                if(target.y !== null && target.s != null && target.f != null && target.l != null) {
                    arrow.innerHTML = getPath(target.y, target.f, target.l, target.s, null);
                }
                return true;
            },
            get(target, key) {
                return target[key];
            }
        });

    svgPath.y = 30;
    svgPath.s = 0;
    svgPath.f = 8;
    svgPath.l = 32;

    button.addEventListener('click', e => {
        if(!button.classList.contains('loading')) {

            if(!button.classList.contains('animation')) {

                button.classList.add('loading', 'animation');

                gsap.to(svgPath, {
                    f: 2,
                    l: 38,
                    duration: .3,
                    delay: .15
                });

                gsap.to(svgPath, {
                    s: .2,
                    y: 16,
                    duration: .8,
                    delay: .15,
                    ease: Elastic.easeOut.config(1, .4)
                });

                gsap.to(count, {
                    number: '100',
                    duration: 3.8,
                    delay: .8,
                    onUpdate() {
                        countElem.innerHTML = Math.round(count.number) + '%';
                    }
                });

                setTimeout(() => {
                    iconDiv.style.setProperty('overflow', 'visible');
                    setTimeout(() => {
                        button.classList.remove('animation');
                    }, 600);
                }, 4820);

            }

        } else {

            if(!button.classList.contains('animation')) {

                button.classList.add('reset');

                gsap.to(svgPath, {
                    f: 8,
                    l: 32,
                    duration: .4
                });

                gsap.to(svgPath, {
                    s: 0,
                    y: 30,
                    duration: .4
                });

                setTimeout(() => {
                    button.classList.remove('loading', 'reset');
                    iconDiv.removeAttribute('style');
                }, 400);

            }

        }
        e.preventDefault();
    });

});

function getPoint(point, i, a, smoothing) {
    let cp = (current, previous, next, reverse) => {
            let p = previous || current,
                n = next || current,
                o = {
                    length: Math.sqrt(Math.pow(n[0] - p[0], 2) + Math.pow(n[1] - p[1], 2)),
                    angle: Math.atan2(n[1] - p[1], n[0] - p[0])
                },
                angle = o.angle + (reverse ? Math.PI : 0),
                length = o.length * smoothing;
            return [current[0] + Math.cos(angle) * length, current[1] + Math.sin(angle) * length];
        },
        cps = cp(a[i - 1], a[i - 2], point, false),
        cpe = cp(point, a[i - 1], a[i + 1], true);
    return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
}

function getPath(update, first, last, smoothing, pointsNew) {
    let points = pointsNew ? pointsNew : [
            [first, 16],
            [20, update],
            [last, 16]
        ],
        d = points.reduce((acc, point, i, a) => i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${getPoint(point, i, a, smoothing)}`, '');
    return `<path d="${d}" />`;
}