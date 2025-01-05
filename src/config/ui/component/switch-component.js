class SwitchComponent {

    render(id, initValue) {

        const checkboxComponent = $(this.template(id, initValue));

        checkboxComponent.find(`#${id}-span`).css("before", {
            "position": "absolute",
            "content": "",
            "height": "26px",
            "width": "26px",
            "left": "4px",
            "bottom": "4px",
            "background-color": "white",
            "-webkit-transition": ".4s",
            "transition": ".4s",
            "border-radius": "50%",
        });

        checkboxComponent.find(`#${id}`).on("change", function () {

        });

        return checkboxComponent.clone().html();
    }

    template(id, initValue) {
        return `
<div style="position: relative; display: inline-block; width: 60px; height: 34px;">
  <input type="checkbox" id="${id}" style="opacity: 0; width: 0; height: 0;">
  <span id="${id}-span" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; border-radius: 34px;"></span>
</div>
`;
    }

}

function renderSwitchComponent(id, initValue) {
    return new SwitchComponent().render(id, initValue);
}

module.exports = {
    SwitchComponent,
    renderSwitchComponent
}
