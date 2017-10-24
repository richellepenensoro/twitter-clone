(() => {

    const dropdowns = [];
    const dropdownContentHiddenClass = 'dropdown-content--hidden';

    $$('.js-dropdown').forEach(initializeDropdown);

    document.addEventListener('click', () => dropdowns.forEach(closeDropdown));

    function initializeDropdown(dropdown) {
        dropdowns.push(dropdown);
        const trigger = $('.js-dropdown-trigger', dropdown);
        const content = $('.js-dropdown-content', dropdown);

        trigger.addEventListener('click', e => {
            e.stopPropagation();
            content.classList.toggle(dropdownContentHiddenClass);
        });

        content.addEventListener('click', e => e.stopPropagation());
    }

    function closeDropdown(dropdown) {
        const content = $('.js-dropdown-content', dropdown);
        content.classList.add(dropdownContentHiddenClass);
    }

})();
