/// <reference types="react" />
import { TippyProps } from '@tippyjs/react';
import { TippyControl } from './TooltipComponent';
export declare type TippyComponentProps = Omit<TippyProps, 'content' | 'visible' | 'getReferenceClientRect' | 'interactive' | 'reference' | 'onDestroy'>;
interface Props {
    node: string;
    register: (node: string, control: TippyControl) => void;
}
export default function TippyComponent(props: Props): JSX.Element;
export {};
