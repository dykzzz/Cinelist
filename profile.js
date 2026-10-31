const sideNav = document.querySelector('.side-nav');
    const sideNavHandle = document.getElementById('sideNavHandle');

    sideNavHandle.addEventListener('click', () => {
        sideNav.classList.toggle('open');
    });