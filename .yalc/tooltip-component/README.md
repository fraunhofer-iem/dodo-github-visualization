# tooltip-component

This is an easy-to-use React HOC that enables you to use the official Tippy.js for React component for non-React targets. Targets are required to have a Popper VirtualElement. The tooltip's content can be any React component, no DOM manipulation magic needed.  
Try it out in the [example](https://fraunhofer-iem.github.io/tooltip-component/).

## Usage

First, import the `tippyfy` HOC from `tooltip-component`:

```js
import tippyfy from 'tooltip-component';
```

Now, just wrap the component that has access to the tooltip targets in the HOC:

```js
const tippyfy(function TooltipController(props) {
    [...]
}
```

The wrapped component is given a new prop `setTippy`, with which you can control the tooltip of the target (identified by a string ID). For example, in order to add tooltips to CytoscapeJS nodes, you would just add some code like this to where you control your Cytoscape instance:

```js
    cy.on('tap', 'node', (event) => {
        const node = event.target;

        const update = () => {
            props.setTippy(node.id(), { popperRef: node.popperRef() });
        };

        props.setTippy(node.id(), {
            content: (
                <Widget
                    bgColor={node.data('widgetColor')}
                    dismiss={() => {
                        props.setTippy(node.id(), { content: null });
                    }
                }
            />),
            popperRef: node.popperRef(),
            dispose: () => {
                node.removeListener('position', undefined, update);
                node.cy().removeListener('pan', update);
            },
        });

        node.on('position', update);
        node.cy().on('pan', update);
    }
```

This adds a `Widget` component as a sticky tooltip to any tapped node.

### TypeScript

If you are using TypeScript (please do), you should also import `TooltipControl` from `tooltip-component`:

```js
import { TooltipControl } from 'tooltip-component';
```

This interface defines the signature of the `setTippy` method. Be polite to your compiler and inform it about the new prop by extending `TooltipControl`:

```ts
interface Props extends TooltipControl{
    [...]
}

const tippyfy(function TooltipController(props: Props) {
    [...]
}
```

## Notes

- In order to increase performance, the `Tippy` component is only rendered, if both `content` and `popperRef` are set
- The target IDs do not have to be known before hand. Their tooltips are prepared dynamically, if a new ID is passed to `setTippy`
- It's not possible to completely delete a tooltip target. However, as described above, setting either `content`or `popperRef` to `null` prevents the `Tippy` component from being rendered.
- There is no limit to the amount of tooltips being displayed simultaneously.
- You can set additional `Tippy` props by specifying them in the `tippyProps` argument of `setTippy`. Excluded from this are the following props:

```js
'content'; // set using the 'content' argument of 'setTippy'
'visible'; // a rendered tooltip is always visible. Otherwise, it is not rendered
'getReferenceClientRect'; // set using the 'popperRef' argument of 'setTippy'
'interactive'; // always enabled
'reference'; // defined by the Popper VirtualElement
'onDestroy'; // set using the 'dispose' argument of 'setTippy'
```

## Build

This is a minimal build setup based soly on rollup. There is not much optimization or special configuration going on here. Execute `yarn build` to build and bundle the component into the `dist` folder.

## Library Development

If you want to locally test / install this library we recomment to use [yalc](https://github.com/wclr/yalc). Just follow the description in their documentation and you are good to go.

```

```
