import $ from 'jquery';

/**
 * 开关组件类
 */
export class SwitchComponent {
    /**
     * 渲染开关组件
     * @param id 组件ID
     * @param initValue 初始值
     * @returns 渲染后的HTML字符串
     */
    render(id: string, initValue: boolean): string {
        const checkboxComponent = $(this.template(id, initValue));

        checkboxComponent.find(`#${id}-span`).css({
            "position": "absolute",
            "content": "",
            "height": "26px",
            "width": "26px",
            "left": "4px",
            "bottom": "4px",
            "backgroundColor": "white",
            "transition": ".4s",
            "borderRadius": "50%",
        } as JQuery.PlainObject);

        checkboxComponent.find(`#${id}`).on("change", function () {
            // 事件处理逻辑可以在这里添加
        });

        return checkboxComponent.clone().html() || '';
    }

    /**
     * 生成开关组件的HTML模板
     * @param id 组件ID
     * @param initValue 初始值
     * @returns HTML模板字符串
     */
    private template(id: string, initValue: boolean): string {
        return `
<div style="position: relative; display: inline-block; width: 60px; height: 34px;">
  <input type="checkbox" id="${id}" style="opacity: 0; width: 0; height: 0;" ${initValue ? 'checked' : ''}>
  <span id="${id}-span" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; border-radius: 34px;"></span>
</div>
`;
    }
}

/**
 * 渲染开关组件的便捷函数
 * @param id 组件ID
 * @param initValue 初始值
 * @returns 渲染后的HTML字符串
 */
export function renderSwitchComponent(id: string, initValue: boolean): string {
    return new SwitchComponent().render(id, initValue);
} 