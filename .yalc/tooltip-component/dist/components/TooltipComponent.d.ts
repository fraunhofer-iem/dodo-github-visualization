import popper from '@popperjs/core';
import * as React from 'react';
import { TippyComponentProps } from './TippyComponent';
/**
 * Tippyfied components obtain a new prop ´setTippy` which allows to set
 * an interactive Tippy tooltip for an arbitrary target.
 */
export interface TooltipControl {
    setTippy: (target: string, props: {
        content?: React.ReactNode;
        popperRef?: popper.VirtualElement;
        dispose?: () => void;
        tippyProps?: TippyComponentProps;
    }) => void;
}
/**
 * Add necessary hooks to the component passed as parameter
 * in order to allow control of Tippy tooltips within the wrapped component.
 * Also add TooltipComponent to the virtual DOM.
 */
export declare function tippyfy(component: (props: any) => React.ReactNode): (props: {
    [key: string]: any;
}) => JSX.Element;
export declare type TippyControl = {
    setContent: (content: React.ReactNode) => void;
    setReference: (popperRef: popper.VirtualElement | undefined) => void;
    setDispose: (dispose: () => void) => void;
    additionalProps: (props: TippyComponentProps) => void;
};
