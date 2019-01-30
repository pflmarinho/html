/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createElement", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneElement", function() { return cloneElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return Component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rerender", function() { return rerender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "options", function() { return options; });
/** Virtual DOM Node */
function VNode() {}

/** Global options
 *	@public
 *	@namespace options {Object}
 */
var options = {

	/** If `true`, `prop` changes trigger synchronous component updates.
  *	@name syncComponentUpdates
  *	@type Boolean
  *	@default true
  */
	//syncComponentUpdates: true,

	/** Processes all created VNodes.
  *	@param {VNode} vnode	A newly-created VNode to normalize/process
  */
	//vnode(vnode) { }

	/** Hook invoked after a component is mounted. */
	// afterMount(component) { }

	/** Hook invoked after the DOM is updated with a component's latest render. */
	// afterUpdate(component) { }

	/** Hook invoked immediately before a component is unmounted. */
	// beforeUnmount(component) { }
};

var stack = [];

var EMPTY_CHILDREN = [];

/** JSX/hyperscript reviver
*	Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
 *	@see http://jasonformat.com/wtf-is-jsx
 *	@public
 */
function h(nodeName, attributes) {
	var children = EMPTY_CHILDREN,
	    lastSimple,
	    child,
	    simple,
	    i;
	for (i = arguments.length; i-- > 2;) {
		stack.push(arguments[i]);
	}
	if (attributes && attributes.children != null) {
		if (!stack.length) stack.push(attributes.children);
		delete attributes.children;
	}
	while (stack.length) {
		if ((child = stack.pop()) && child.pop !== undefined) {
			for (i = child.length; i--;) {
				stack.push(child[i]);
			}
		} else {
			if (typeof child === 'boolean') child = null;

			if (simple = typeof nodeName !== 'function') {
				if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
			}

			if (simple && lastSimple) {
				children[children.length - 1] += child;
			} else if (children === EMPTY_CHILDREN) {
				children = [child];
			} else {
				children.push(child);
			}

			lastSimple = simple;
		}
	}

	var p = new VNode();
	p.nodeName = nodeName;
	p.children = children;
	p.attributes = attributes == null ? undefined : attributes;
	p.key = attributes == null ? undefined : attributes.key;

	// if a "vnode hook" is defined, pass every created VNode to it
	if (options.vnode !== undefined) options.vnode(p);

	return p;
}

/** Copy own-properties from `props` onto `obj`.
 *	@returns obj
 *	@private
 */
function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }return obj;
}

/** Call a function asynchronously, as soon as possible.
 *	@param {Function} callback
 */
var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

function cloneElement(vnode, props) {
	return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
}

// DOM properties that should NOT have "px" added when numeric
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

/** Managed queue of dirty components to be re-rendered */

var items = [];

function enqueueRender(component) {
	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
		(options.debounceRendering || defer)(rerender);
	}
}

function rerender() {
	var p,
	    list = items;
	items = [];
	while (p = list.pop()) {
		if (p._dirty) renderComponent(p);
	}
}

/** Check if two nodes are equivalent.
 *	@param {Element} node
 *	@param {VNode} vnode
 *	@private
 */
function isSameNodeType(node, vnode, hydrating) {
	if (typeof vnode === 'string' || typeof vnode === 'number') {
		return node.splitText !== undefined;
	}
	if (typeof vnode.nodeName === 'string') {
		return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
	}
	return hydrating || node._componentConstructor === vnode.nodeName;
}

/** Check if an Element has a given normalized name.
*	@param {Element} node
*	@param {String} nodeName
 */
function isNamedNode(node, nodeName) {
	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

/**
 * Reconstruct Component-style `props` from a VNode.
 * Ensures default/fallback values from `defaultProps`:
 * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
 * @param {VNode} vnode
 * @returns {Object} props
 */
function getNodeProps(vnode) {
	var props = extend({}, vnode.attributes);
	props.children = vnode.children;

	var defaultProps = vnode.nodeName.defaultProps;
	if (defaultProps !== undefined) {
		for (var i in defaultProps) {
			if (props[i] === undefined) {
				props[i] = defaultProps[i];
			}
		}
	}

	return props;
}

/** Create an element with the given nodeName.
 *	@param {String} nodeName
 *	@param {Boolean} [isSvg=false]	If `true`, creates an element within the SVG namespace.
 *	@returns {Element} node
 */
function createNode(nodeName, isSvg) {
	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
	node.normalizedNodeName = nodeName;
	return node;
}

/** Remove a child node from its parent if attached.
 *	@param {Element} node		The node to remove
 */
function removeNode(node) {
	var parentNode = node.parentNode;
	if (parentNode) parentNode.removeChild(node);
}

/** Set a named attribute on the given Node, with special behavior for some names and event handlers.
 *	If `value` is `null`, the attribute/handler will be removed.
 *	@param {Element} node	An element to mutate
 *	@param {string} name	The name/key to set, such as an event or attribute name
 *	@param {any} old	The last value that was set for this name/node pair
 *	@param {any} value	An attribute value, such as a function to be used as an event handler
 *	@param {Boolean} isSvg	Are we currently diffing inside an svg?
 *	@private
 */
function setAccessor(node, name, old, value, isSvg) {
	if (name === 'className') name = 'class';

	if (name === 'key') {
		// ignore
	} else if (name === 'ref') {
		if (old) old(null);
		if (value) value(node);
	} else if (name === 'class' && !isSvg) {
		node.className = value || '';
	} else if (name === 'style') {
		if (!value || typeof value === 'string' || typeof old === 'string') {
			node.style.cssText = value || '';
		}
		if (value && typeof value === 'object') {
			if (typeof old !== 'string') {
				for (var i in old) {
					if (!(i in value)) node.style[i] = '';
				}
			}
			for (var i in value) {
				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
			}
		}
	} else if (name === 'dangerouslySetInnerHTML') {
		if (value) node.innerHTML = value.__html || '';
	} else if (name[0] == 'o' && name[1] == 'n') {
		var useCapture = name !== (name = name.replace(/Capture$/, ''));
		name = name.toLowerCase().substring(2);
		if (value) {
			if (!old) node.addEventListener(name, eventProxy, useCapture);
		} else {
			node.removeEventListener(name, eventProxy, useCapture);
		}
		(node._listeners || (node._listeners = {}))[name] = value;
	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
		setProperty(node, name, value == null ? '' : value);
		if (value == null || value === false) node.removeAttribute(name);
	} else {
		var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));
		if (value == null || value === false) {
			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
		} else if (typeof value !== 'function') {
			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
		}
	}
}

/** Attempt to set a DOM property to the given value.
 *	IE & FF throw for certain property-value combinations.
 */
function setProperty(node, name, value) {
	try {
		node[name] = value;
	} catch (e) {}
}

/** Proxy an event to hooked event handlers
 *	@private
 */
function eventProxy(e) {
	return this._listeners[e.type](options.event && options.event(e) || e);
}

/** Queue of components that have been mounted and are awaiting componentDidMount */
var mounts = [];

/** Diff recursion count, used to track the end of the diff cycle. */
var diffLevel = 0;

/** Global flag indicating if the diff is currently within an SVG */
var isSvgMode = false;

/** Global flag indicating if the diff is performing hydration */
var hydrating = false;

/** Invoke queued componentDidMount lifecycle methods */
function flushMounts() {
	var c;
	while (c = mounts.pop()) {
		if (options.afterMount) options.afterMount(c);
		if (c.componentDidMount) c.componentDidMount();
	}
}

/** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
 *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
 *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
 *	@returns {Element} dom			The created/mutated element
 *	@private
 */
function diff(dom, vnode, context, mountAll, parent, componentRoot) {
	// diffLevel having been 0 here indicates initial entry into the diff (not a subdiff)
	if (!diffLevel++) {
		// when first starting the diff, check if we're diffing an SVG or within an SVG
		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

		// hydration is indicated by the existing element to be diffed not having a prop cache
		hydrating = dom != null && !('__preactattr_' in dom);
	}

	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

	// append the element if its a new parent
	if (parent && ret.parentNode !== parent) parent.appendChild(ret);

	// diffLevel being reduced to 0 means we're exiting the diff
	if (! --diffLevel) {
		hydrating = false;
		// invoke queued componentDidMount lifecycle methods
		if (!componentRoot) flushMounts();
	}

	return ret;
}

/** Internals of `diff()`, separated to allow bypassing diffLevel / mount flushing. */
function idiff(dom, vnode, context, mountAll, componentRoot) {
	var out = dom,
	    prevSvgMode = isSvgMode;

	// empty values (null, undefined, booleans) render as empty Text nodes
	if (vnode == null || typeof vnode === 'boolean') vnode = '';

	// Fast case: Strings & Numbers create/update Text nodes.
	if (typeof vnode === 'string' || typeof vnode === 'number') {

		// update if it's already a Text node:
		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
			/* istanbul ignore if */ /* Browser quirk that can't be covered: https://github.com/developit/preact/commit/fd4f21f5c45dfd75151bd27b4c217d8003aa5eb9 */
			if (dom.nodeValue != vnode) {
				dom.nodeValue = vnode;
			}
		} else {
			// it wasn't a Text node: replace it with one and recycle the old Element
			out = document.createTextNode(vnode);
			if (dom) {
				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
				recollectNodeTree(dom, true);
			}
		}

		out['__preactattr_'] = true;

		return out;
	}

	// If the VNode represents a Component, perform a component diff:
	var vnodeName = vnode.nodeName;
	if (typeof vnodeName === 'function') {
		return buildComponentFromVNode(dom, vnode, context, mountAll);
	}

	// Tracks entering and exiting SVG namespace when descending through the tree.
	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

	// If there's no existing element or it's the wrong type, create a new one:
	vnodeName = String(vnodeName);
	if (!dom || !isNamedNode(dom, vnodeName)) {
		out = createNode(vnodeName, isSvgMode);

		if (dom) {
			// move children into the replacement node
			while (dom.firstChild) {
				out.appendChild(dom.firstChild);
			} // if the previous Element was mounted into the DOM, replace it inline
			if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

			// recycle the old element (skips non-Element node types)
			recollectNodeTree(dom, true);
		}
	}

	var fc = out.firstChild,
	    props = out['__preactattr_'],
	    vchildren = vnode.children;

	if (props == null) {
		props = out['__preactattr_'] = {};
		for (var a = out.attributes, i = a.length; i--;) {
			props[a[i].name] = a[i].value;
		}
	}

	// Optimization: fast-path for elements containing a single TextNode:
	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
		if (fc.nodeValue != vchildren[0]) {
			fc.nodeValue = vchildren[0];
		}
	}
	// otherwise, if there are existing or new children, diff them:
	else if (vchildren && vchildren.length || fc != null) {
			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
		}

	// Apply attributes/props from VNode to the DOM Element:
	diffAttributes(out, vnode.attributes, props);

	// restore previous SVG mode: (in case we're exiting an SVG namespace)
	isSvgMode = prevSvgMode;

	return out;
}

/** Apply child and attribute changes between a VNode and a DOM Node to the DOM.
 *	@param {Element} dom			Element whose children should be compared & mutated
 *	@param {Array} vchildren		Array of VNodes to compare to `dom.childNodes`
 *	@param {Object} context			Implicitly descendant context object (from most recent `getChildContext()`)
 *	@param {Boolean} mountAll
 *	@param {Boolean} isHydrating	If `true`, consumes externally created elements similar to hydration
 */
function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
	var originalChildren = dom.childNodes,
	    children = [],
	    keyed = {},
	    keyedLen = 0,
	    min = 0,
	    len = originalChildren.length,
	    childrenLen = 0,
	    vlen = vchildren ? vchildren.length : 0,
	    j,
	    c,
	    f,
	    vchild,
	    child;

	// Build up a map of keyed children and an Array of unkeyed children:
	if (len !== 0) {
		for (var i = 0; i < len; i++) {
			var _child = originalChildren[i],
			    props = _child['__preactattr_'],
			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
			if (key != null) {
				keyedLen++;
				keyed[key] = _child;
			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
				children[childrenLen++] = _child;
			}
		}
	}

	if (vlen !== 0) {
		for (var i = 0; i < vlen; i++) {
			vchild = vchildren[i];
			child = null;

			// attempt to find a node based on key matching
			var key = vchild.key;
			if (key != null) {
				if (keyedLen && keyed[key] !== undefined) {
					child = keyed[key];
					keyed[key] = undefined;
					keyedLen--;
				}
			}
			// attempt to pluck a node of the same type from the existing children
			else if (!child && min < childrenLen) {
					for (j = min; j < childrenLen; j++) {
						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
							child = c;
							children[j] = undefined;
							if (j === childrenLen - 1) childrenLen--;
							if (j === min) min++;
							break;
						}
					}
				}

			// morph the matched/found/created DOM child to match vchild (deep)
			child = idiff(child, vchild, context, mountAll);

			f = originalChildren[i];
			if (child && child !== dom && child !== f) {
				if (f == null) {
					dom.appendChild(child);
				} else if (child === f.nextSibling) {
					removeNode(f);
				} else {
					dom.insertBefore(child, f);
				}
			}
		}
	}

	// remove unused keyed children:
	if (keyedLen) {
		for (var i in keyed) {
			if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
		}
	}

	// remove orphaned unkeyed children:
	while (min <= childrenLen) {
		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
	}
}

/** Recursively recycle (or just unmount) a node and its descendants.
 *	@param {Node} node						DOM node to start unmount/removal from
 *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
 */
function recollectNodeTree(node, unmountOnly) {
	var component = node._component;
	if (component) {
		// if node is owned by a Component, unmount that component (ends up recursing back here)
		unmountComponent(component);
	} else {
		// If the node's VNode had a ref function, invoke it with null here.
		// (this is part of the React spec, and smart for unsetting references)
		if (node['__preactattr_'] != null && node['__preactattr_'].ref) node['__preactattr_'].ref(null);

		if (unmountOnly === false || node['__preactattr_'] == null) {
			removeNode(node);
		}

		removeChildren(node);
	}
}

/** Recollect/unmount all children.
 *	- we use .lastChild here because it causes less reflow than .firstChild
 *	- it's also cheaper than accessing the .childNodes Live NodeList
 */
function removeChildren(node) {
	node = node.lastChild;
	while (node) {
		var next = node.previousSibling;
		recollectNodeTree(node, true);
		node = next;
	}
}

/** Apply differences in attributes from a VNode to the given DOM Element.
 *	@param {Element} dom		Element with attributes to diff `attrs` against
 *	@param {Object} attrs		The desired end-state key-value attribute pairs
 *	@param {Object} old			Current/previous attributes (from previous VNode or element's prop cache)
 */
function diffAttributes(dom, attrs, old) {
	var name;

	// remove attributes no longer present on the vnode by setting them to undefined
	for (name in old) {
		if (!(attrs && attrs[name] != null) && old[name] != null) {
			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
		}
	}

	// add new & update changed attributes
	for (name in attrs) {
		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
		}
	}
}

/** Retains a pool of Components for re-use, keyed on component name.
 *	Note: since component names are not unique or even necessarily available, these are primarily a form of sharding.
 *	@private
 */
var components = {};

/** Reclaim a component for later re-use by the recycler. */
function collectComponent(component) {
	var name = component.constructor.name;
	(components[name] || (components[name] = [])).push(component);
}

/** Create a component. Normalizes differences between PFC's and classful Components. */
function createComponent(Ctor, props, context) {
	var list = components[Ctor.name],
	    inst;

	if (Ctor.prototype && Ctor.prototype.render) {
		inst = new Ctor(props, context);
		Component.call(inst, props, context);
	} else {
		inst = new Component(props, context);
		inst.constructor = Ctor;
		inst.render = doRender;
	}

	if (list) {
		for (var i = list.length; i--;) {
			if (list[i].constructor === Ctor) {
				inst.nextBase = list[i].nextBase;
				list.splice(i, 1);
				break;
			}
		}
	}
	return inst;
}

/** The `.render()` method for a PFC backing instance. */
function doRender(props, state, context) {
	return this.constructor(props, context);
}

/** Set a component's `props` (generally derived from JSX attributes).
 *	@param {Object} props
 *	@param {Object} [opts]
 *	@param {boolean} [opts.renderSync=false]	If `true` and {@link options.syncComponentUpdates} is `true`, triggers synchronous rendering.
 *	@param {boolean} [opts.render=true]			If `false`, no render will be triggered.
 */
function setComponentProps(component, props, opts, context, mountAll) {
	if (component._disable) return;
	component._disable = true;

	if (component.__ref = props.ref) delete props.ref;
	if (component.__key = props.key) delete props.key;

	if (!component.base || mountAll) {
		if (component.componentWillMount) component.componentWillMount();
	} else if (component.componentWillReceiveProps) {
		component.componentWillReceiveProps(props, context);
	}

	if (context && context !== component.context) {
		if (!component.prevContext) component.prevContext = component.context;
		component.context = context;
	}

	if (!component.prevProps) component.prevProps = component.props;
	component.props = props;

	component._disable = false;

	if (opts !== 0) {
		if (opts === 1 || options.syncComponentUpdates !== false || !component.base) {
			renderComponent(component, 1, mountAll);
		} else {
			enqueueRender(component);
		}
	}

	if (component.__ref) component.__ref(component);
}

/** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
 *	@param {Component} component
 *	@param {Object} [opts]
 *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
 *	@private
 */
function renderComponent(component, opts, mountAll, isChild) {
	if (component._disable) return;

	var props = component.props,
	    state = component.state,
	    context = component.context,
	    previousProps = component.prevProps || props,
	    previousState = component.prevState || state,
	    previousContext = component.prevContext || context,
	    isUpdate = component.base,
	    nextBase = component.nextBase,
	    initialBase = isUpdate || nextBase,
	    initialChildComponent = component._component,
	    skip = false,
	    rendered,
	    inst,
	    cbase;

	// if updating
	if (isUpdate) {
		component.props = previousProps;
		component.state = previousState;
		component.context = previousContext;
		if (opts !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
			skip = true;
		} else if (component.componentWillUpdate) {
			component.componentWillUpdate(props, state, context);
		}
		component.props = props;
		component.state = state;
		component.context = context;
	}

	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	component._dirty = false;

	if (!skip) {
		rendered = component.render(props, state, context);

		// context to pass to the child, can be updated via (grand-)parent component
		if (component.getChildContext) {
			context = extend(extend({}, context), component.getChildContext());
		}

		var childComponent = rendered && rendered.nodeName,
		    toUnmount,
		    base;

		if (typeof childComponent === 'function') {
			// set up high order component link

			var childProps = getNodeProps(rendered);
			inst = initialChildComponent;

			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
				setComponentProps(inst, childProps, 1, context, false);
			} else {
				toUnmount = inst;

				component._component = inst = createComponent(childComponent, childProps, context);
				inst.nextBase = inst.nextBase || nextBase;
				inst._parentComponent = component;
				setComponentProps(inst, childProps, 0, context, false);
				renderComponent(inst, 1, mountAll, true);
			}

			base = inst.base;
		} else {
			cbase = initialBase;

			// destroy high order component link
			toUnmount = initialChildComponent;
			if (toUnmount) {
				cbase = component._component = null;
			}

			if (initialBase || opts === 1) {
				if (cbase) cbase._component = null;
				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
			}
		}

		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
			var baseParent = initialBase.parentNode;
			if (baseParent && base !== baseParent) {
				baseParent.replaceChild(base, initialBase);

				if (!toUnmount) {
					initialBase._component = null;
					recollectNodeTree(initialBase, false);
				}
			}
		}

		if (toUnmount) {
			unmountComponent(toUnmount);
		}

		component.base = base;
		if (base && !isChild) {
			var componentRef = component,
			    t = component;
			while (t = t._parentComponent) {
				(componentRef = t).base = base;
			}
			base._component = componentRef;
			base._componentConstructor = componentRef.constructor;
		}
	}

	if (!isUpdate || mountAll) {
		mounts.unshift(component);
	} else if (!skip) {
		// Ensure that pending componentDidMount() hooks of child components
		// are called before the componentDidUpdate() hook in the parent.
		// Note: disabled as it causes duplicate hooks, see https://github.com/developit/preact/issues/750
		// flushMounts();

		if (component.componentDidUpdate) {
			component.componentDidUpdate(previousProps, previousState, previousContext);
		}
		if (options.afterUpdate) options.afterUpdate(component);
	}

	if (component._renderCallbacks != null) {
		while (component._renderCallbacks.length) {
			component._renderCallbacks.pop().call(component);
		}
	}

	if (!diffLevel && !isChild) flushMounts();
}

/** Apply the Component referenced by a VNode to the DOM.
 *	@param {Element} dom	The DOM node to mutate
 *	@param {VNode} vnode	A Component-referencing VNode
 *	@returns {Element} dom	The created/mutated element
 *	@private
 */
function buildComponentFromVNode(dom, vnode, context, mountAll) {
	var c = dom && dom._component,
	    originalComponent = c,
	    oldDom = dom,
	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
	    isOwner = isDirectOwner,
	    props = getNodeProps(vnode);
	while (c && !isOwner && (c = c._parentComponent)) {
		isOwner = c.constructor === vnode.nodeName;
	}

	if (c && isOwner && (!mountAll || c._component)) {
		setComponentProps(c, props, 3, context, mountAll);
		dom = c.base;
	} else {
		if (originalComponent && !isDirectOwner) {
			unmountComponent(originalComponent);
			dom = oldDom = null;
		}

		c = createComponent(vnode.nodeName, props, context);
		if (dom && !c.nextBase) {
			c.nextBase = dom;
			// passing dom/oldDom as nextBase will recycle it if unused, so bypass recycling on L229:
			oldDom = null;
		}
		setComponentProps(c, props, 1, context, mountAll);
		dom = c.base;

		if (oldDom && dom !== oldDom) {
			oldDom._component = null;
			recollectNodeTree(oldDom, false);
		}
	}

	return dom;
}

/** Remove a component from the DOM and recycle it.
 *	@param {Component} component	The Component instance to unmount
 *	@private
 */
function unmountComponent(component) {
	if (options.beforeUnmount) options.beforeUnmount(component);

	var base = component.base;

	component._disable = true;

	if (component.componentWillUnmount) component.componentWillUnmount();

	component.base = null;

	// recursively tear down & recollect high-order component children:
	var inner = component._component;
	if (inner) {
		unmountComponent(inner);
	} else if (base) {
		if (base['__preactattr_'] && base['__preactattr_'].ref) base['__preactattr_'].ref(null);

		component.nextBase = base;

		removeNode(base);
		collectComponent(component);

		removeChildren(base);
	}

	if (component.__ref) component.__ref(null);
}

/** Base Component class.
 *	Provides `setState()` and `forceUpdate()`, which trigger rendering.
 *	@public
 *
 *	@example
 *	class MyFoo extends Component {
 *		render(props, state) {
 *			return <div />;
 *		}
 *	}
 */
function Component(props, context) {
	this._dirty = true;

	/** @public
  *	@type {object}
  */
	this.context = context;

	/** @public
  *	@type {object}
  */
	this.props = props;

	/** @public
  *	@type {object}
  */
	this.state = this.state || {};
}

extend(Component.prototype, {

	/** Returns a `boolean` indicating if the component should re-render when receiving the given `props` and `state`.
  *	@param {object} nextProps
  *	@param {object} nextState
  *	@param {object} nextContext
  *	@returns {Boolean} should the component re-render
  *	@name shouldComponentUpdate
  *	@function
  */

	/** Update component state by copying properties from `state` to `this.state`.
  *	@param {object} state		A hash of state properties to update with new values
  *	@param {function} callback	A function to be called once component state is updated
  */
	setState: function setState(state, callback) {
		var s = this.state;
		if (!this.prevState) this.prevState = extend({}, s);
		extend(s, typeof state === 'function' ? state(s, this.props) : state);
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		enqueueRender(this);
	},


	/** Immediately perform a synchronous re-render of the component.
  *	@param {function} callback		A function to be called after component is re-rendered.
  *	@private
  */
	forceUpdate: function forceUpdate(callback) {
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		renderComponent(this, 2);
	},


	/** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
  *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
  *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
  *	@param {object} state		The component's current state
  *	@param {object} context		Context object (if a parent component has provided context)
  *	@returns VNode
  */
	render: function render() {}
});

/** Render JSX into a `parent` Element.
 *	@param {VNode} vnode		A (JSX) VNode to render
 *	@param {Element} parent		DOM element to render into
 *	@param {Element} [merge]	Attempt to re-use an existing DOM tree rooted at `merge`
 *	@public
 *
 *	@example
 *	// render a div into <body>:
 *	render(<div id="hello">hello!</div>, document.body);
 *
 *	@example
 *	// render a "Thing" component into #foo:
 *	const Thing = ({ name }) => <span>{ name }</span>;
 *	render(<Thing name="one" />, document.querySelector('#foo'));
 */
function render(vnode, parent, merge) {
  return diff(merge, vnode, {}, false, parent, false);
}

var preact = {
	h: h,
	createElement: h,
	cloneElement: cloneElement,
	Component: Component,
	render: render,
	rerender: rerender,
	options: options
};


/* harmony default export */ __webpack_exports__["default"] = (preact);
//# sourceMappingURL=preact.esm.js.map


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=4)}([function(t,e){t.exports=__webpack_require__(0)},function(t,e,n){"use strict";function i(t,e){var n=[t];return e.className&&n.push(e.className),e.class&&n.push(e.class),n.join(" ")}function o(t){return(0,f.h)("div",{className:i(h.classPrefix,t)},t.children)}function a(t){return(0,f.h)("div",{className:i(h.classPrefix+"__header",t)},t.children)}function r(t){return(0,f.h)("h2",{className:i(h.classPrefix+"__title",t)},t.children)}function l(t){return(0,f.h)("div",{className:i(h.classPrefix+"__content",t)},t.children)}function s(t){return(0,f.h)("section",d({},t,{className:i(h.classPrefix+"__section",t)}),t.children)}function c(t){var e="left"==t.renderThumbnail?"right":"left",n=t.thumbnailFormat?t.thumbnailFormat:"squad",o={device_group:_,"feed-type":"COMPONENTE","post-id":t.post&&t.post.id?t.post.id:"null","post-type":t.post&&t.post.type?t.post.type:"null"};return(0,f.h)(l,{className:"\n        "+i(h.classPrefix+"__content",t)+"\n        post-list--align-"+e+"\n      "},(0,f.h)("ul",null,t.item.map(function(e,i){return(0,f.h)(m.default,{horizonData:Object.assign({"post-url":e.url,"post-has-photo":e.thumbnail?"true":"false"},o,t.horizonData),key:i,position:i+1,renderThumbnail:t.renderThumbnail,bastianToolkit:t.bastianToolkit,thumbnailFormat:n,svg:t.svg,item:e,gaLabel:t.gaLabel,gaAction:t.gaAction})})))}function u(t){return(0,f.h)("footer",{className:i(h.classPrefix+"__footer theme",t)},t.children)}Object.defineProperty(e,"__esModule",{value:!0});var d=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t};e.Post=o,e.Header=a,e.Title=r,e.Content=l,e.Section=s,e.ListPost=c,e.Footer=u;var f=n(0),h=n(5),p=n(2),m=function(t){return t&&t.__esModule?t:{default:t}}(p),_=window.SETTINGS.BASTIAN.DEVICE_GROUP;u.Link=function(t){return(0,f.h)("a",{className:i(h.classPrefix+"__footer-link",t),href:t.href},t.children,(0,f.h)("span",{className:h.classPrefix+"__arrow"},(0,f.h)("svg",{viewBox:"2 2 18 18"},(0,f.h)("path",{d:"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"}))))}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(0),o=n(1),a=n(3),r=function(t){var e=t.thumbnailFormat,n=t.item,o=t.svg;return n.thumbnail?(0,i.h)("div",{className:"post-list__column-right"},(0,i.h)("div",{className:"post-list__column-right__image-"+e},l(o),(0,i.h)("img",{src:n.thumbnail,alt:n.title}))):null},l=function(t){return t?(0,i.h)("svg",{className:"post-list__column-right__image-squad__icon_player",width:"30px",height:"27px",viewBox:"0 0 30 27",version:"1.1"},(0,i.h)("g",{id:"Post-Playlist",stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},(0,i.h)("g",{id:"BBB-AUTOMATICO-Copy",transform:"translate(-258.000000, -604.000000)",fill:"#FFFFFF"},(0,i.h)("g",{id:"Group-2",transform:"translate(16.000000, 315.000000)"},(0,i.h)("g",{id:"Group-8-Copy"},(0,i.h)("g",{id:"Group",transform:"translate(234.000000, 230.000000)"},(0,i.h)("g",{id:"SINALIZACAO"},(0,i.h)("g",{id:"icon",transform:"translate(8.000000, 58.000000)"},(0,i.h)("polygon",{id:"Fill-3",points:"0.934261363 12.3903949 23.4727793 12.3903949 23.4727793 8.63514534 0.934261363 8.63514534"}),(0,i.h)("polygon",{id:"Fill-6",points:"0.934261363 4.87876905 23.4727793 4.87876905 23.4727793 1.12351946 0.934261363 1.12351946"}),(0,i.h)("polygon",{id:"Fill-9",points:"0.934261363 19.9014575 15.9595644 19.9014575 15.9595644 16.1462079 0.934261363 16.1462079"}),(0,i.h)("polygon",{id:"Fill-12",points:"19.7165663 27.413027 29.1078033 21.7795893 19.7165663 16.1461515"}))))))))):null},s=function(t){var e=t.headline;return e?(0,i.h)("div",{className:"post-list__column-left__headline"},(0,i.h)("p",null,e)):null},c=function(t){var e=t.item;return e.title?(0,i.h)("div",{className:"post-list__column-left__title theme"},(0,i.h)("p",null,e.title)):null},u=function(t){var e=t.description;return e?(0,i.h)("div",{className:"post-list__column-left__description"},(0,i.h)("span",null,e)):null},d=function(t){var e=function(t){return(0,i.h)("a",t," ",t.children)},n=(0,a.withTracking)(e,"onClick",!1),l="clique | post 1 | "+t.gaLabel+" | posicao ",d=t.bastianToolkit?"clique | "+t.bastianToolkit.getAreaId()+" | post "+t.position+" | "+t.gaLabel+" | posicao "+t.bastianToolkit.getItemPosition()+" ":l,f=t.bastianToolkit?Object.assign({"post-position":t.bastianToolkit.getItemPosition()+""},t.horizonData):t.horizonData,h=t.item.className||"";return(0,i.h)(o.Section,{className:"post-list__section "+h},(0,i.h)(n,{horizonData:f,href:t.item.url,gaCategory:"feed",gaAction:t.gaAction,gaLabel:d},(0,i.h)("li",{className:"post-list__item"},(0,i.h)("div",{className:"post-list__column-left"},s(t.item),c(t),u(t.item)),r(t))))};e.default=d},function(t,e,n){"use strict";function i(){f||(f=!0,window.requestIdleCallback(o,{timeout:2e3}))}function o(t){for(f=!1,void 0===t&&(t={timeRemaining:function(){return Number.MAX_VALUE}});t.timeRemaining()>0&&d.length>0;){a(d.pop())}d.length>0&&i()}function a(t){window.ga(c+"_portal.send","event",t.gaEv_category,t.gaEv_action,t.gaEv_label)}function r(t,e){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return function(i){var o=function(t){var o=i.horizonData;i[e]&&i[e](t),h(i.gaCategory,i.gaAction,i.gaLabel,n),p(o)},a=Object.assign({},i);return a[e]=o,(0,l.h)(t,a,i.children)}}Object.defineProperty(e,"__esModule",{value:!0}),e.sendToHorizon=e.sendToGa=void 0,e.withTracking=r;var l=n(0),s=window.cdaaas.SETTINGS,c=s.SITE_ID,u=s.CANONICAL_URL;window.requestIdleCallback=window.requestIdleCallback||function(t){var e=Date.now();return setTimeout(function(){t({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-e))}})},1)},window.cancelIdleCallback=window.cancelIdleCallback||function(t){clearTimeout(t)};var d=[],f=!1,h=e.sendToGa=function(t,e,n){var o=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],r={gaEv_category:t,gaEv_action:e,gaEv_label:n};o?(d.push(r),i()):a(r)},p=e.sendToHorizon=function(t){window.Horizon.Client().sendPostClick({attributes:t,object:u,product:c})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1);Object.keys(i).forEach(function(t){"default"!==t&&"__esModule"!==t&&Object.defineProperty(e,t,{enumerable:!0,get:function(){return i[t]}})});var o=n(3);Object.keys(o).forEach(function(t){"default"!==t&&"__esModule"!==t&&Object.defineProperty(e,t,{enumerable:!0,get:function(){return o[t]}})});var a=n(2);Object.keys(a).forEach(function(t){"default"!==t&&"__esModule"!==t&&Object.defineProperty(e,t,{enumerable:!0,get:function(){return a[t]}})}),n(6)},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.classPrefix="post-bastian-products"},function(t,e){}]);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(e){function t(o){if(a[o])return a[o].exports;var n=a[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var a={};return t.m=e,t.c=a,t.d=function(e,a,o){t.o(e,a)||Object.defineProperty(e,a,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var a=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(a,"a",a),a},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t){e.exports=__webpack_require__(0)},function(e,t,a){"use strict";function o(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1],a=arguments[2];(0,n.render)((0,n.h)(i.default,{bastianToolkit:a,data:e.externalData}),t)}t.__esModule=!0,t.name=t.PostSection=void 0,t.render=o;var n=a(0);a(2);var r=a(3),i=function(e){return e&&e.__esModule?e:{default:e}}(r);t.PostSection=r.PostSection;t.name="post-economia-cotacao"},function(e,t){},function(e,t,a){"use strict";function o(e){return(0,i.h)("a",e,e.children)}function n(e){return(0,i.h)(u.Post,{className:l},(0,i.h)(u.Content,null,r(e)))}function r(e){var t="clique | "+e.bastianToolkit.getAreaId()+" | moedas | com anexo | sem resumo | posicao "+e.bastianToolkit.getItemPosition();return(0,i.h)(u.Section,null,(0,i.h)(d,{href:f,gaCategory:"feed",gaAction:"post economia",gaLabel:t},(0,i.h)("p",{className:l+"__header"},"Compra de Moedas",e.isNotPost?"":(0,i.h)("div",{className:l+"__logo"})),(0,i.h)("table",null,(0,i.h)(c.default,{name:"Dólar Comercial",value:e.data.USDBRLS_VALR.CF_ASK,variation:e.data.USDBRLS_VALR.PCTCHNG,classNamePrefix:l}),(0,i.h)(c.default,{name:"Euro",value:e.data.EURBRLS_VALR.CF_ASK,variation:e.data.EURBRLS_VALR.PCTCHNG,classNamePrefix:l}))))}t.__esModule=!0,t.default=n,t.PostSection=r;var i=a(0),u=a(4),s=a(5),c=function(e){return e&&e.__esModule?e:{default:e}}(s),l="post-economia-cotacao",f="http://www.valor.com.br/valor-data/",d=(0,u.withTracking)(o,"onClick",!1)},function(e,t){e.exports=__webpack_require__(1)},function(e,t,a){"use strict";function o(e){return(0,n.h)("tr",{className:e.classNamePrefix+"__quote"},(0,n.h)("td",{className:e.classNamePrefix+"__quote-name"},e.name),(0,n.h)("td",{className:e.classNamePrefix+"__quote-value"},"R$ ",e.value),(0,n.h)(i.default,{variation:e.variation,className:e.classNamePrefix+"__quote-variation"}))}t.__esModule=!0,t.default=o;var n=a(0),r=a(6),i=function(e){return e&&e.__esModule?e:{default:e}}(r)},function(e,t,a){"use strict";function o(e){var t=e.className,a=e.variation.toLocaleString("pt-BR")+"%";return e.variation<0?t+=" "+e.className+"--negative":a="+"+a,(0,n.h)("td",{className:t},a)}t.__esModule=!0,t.default=o;var n=a(0)}]);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(t){function e(a){if(o[a])return o[a].exports;var n=o[a]={i:a,l:!1,exports:{}};return t[a].call(n.exports,n,n.exports,e),n.l=!0,n.exports}var o={};return e.m=t,e.c=o,e.d=function(t,o,a){e.o(t,o)||Object.defineProperty(t,o,{configurable:!1,enumerable:!0,get:a})},e.n=function(t){var o=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(o,"a",o),o},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/Users/cyro/projetos/jornalismo/post-economia-bolsa/dist",e(e.s=2)}([function(t,e){t.exports=__webpack_require__(0)},function(t,e,o){"use strict";e.__esModule=!0,e.PostName="post-economia-bolsa"},function(t,e,o){"use strict";function a(t,e,o){(0,n.render)((0,n.h)(s.default,{bastianToolkit:o,data:t.externalData}),e)}e.__esModule=!0,e.name=e.PostSection=void 0,e.render=a;var n=o(0),r=o(1);o(3);var i=o(4),s=function(t){return t&&t.__esModule?t:{default:t}}(i);e.PostSection=i.PostSection,e.name=r.PostName},function(t,e){},function(t,e,o){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}function n(t){return(0,s.h)("a",t,t.children)}function r(t){return(0,s.h)(c.Post,{className:l.PostName},(0,s.h)(c.Content,null,i(t)))}function i(t){var e="clique | "+t.bastianToolkit.getAreaId()+" | ibovespa | com anexo | sem resumo | posicao "+t.bastianToolkit.getItemPosition();return(0,s.h)(c.Section,null,(0,s.h)(f,{href:m,gaCategory:"feed",gaAction:"post economia",gaLabel:e},(0,s.h)("p",{className:l.PostName+"__header"},"Ibovespa",t.isNotPost?"":(0,s.h)("div",{className:l.PostName+"__logo"})),(0,s.h)(h.default,{quote:t.data.IBOV}),(0,s.h)(p.default,{date:t.data.IBOV.DT_ULTIMA_ACAO,time:t.data.IBOV.HR_ULTIMA_ACAO})))}e.__esModule=!0,e.default=r,e.PostSection=i;var s=o(0),c=o(5),l=o(1),u=o(6),h=a(u),d=o(9),p=a(d),m="http://www.valor.com.br/valor-data/",f=(0,c.withTracking)(n,"onClick",!1)},function(t,e){t.exports=__webpack_require__(1)},function(t,e,o){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}function n(t){var e=t.quote.PCTCHNG,o=Math.round(t.quote.CF_LAST).toLocaleString("pt-BR")+" pontos";return(0,r.h)("div",{className:i.PostName+"__quote"},(0,r.h)("div",{className:i.PostName+"__quote-summary"},(0,r.h)("div",{className:i.PostName+"__quote-percentage"},(0,r.h)(u.default,{value:e,symbolClass:i.PostName+"__quote-percentage-symbol"},(0,r.h)("span",{className:i.PostName+"__quote-percentage-symbol"},"%"))),(0,r.h)("div",{className:i.PostName+"__quote-last-value",title:o},o)),(0,r.h)("div",{className:i.PostName+"__quote-chart"},(0,r.h)(c.default,{tipo:e>=0?"positivo":"negativo"})))}e.__esModule=!0,e.default=n;var r=o(0),i=o(1),s=o(7),c=a(s),l=o(8),u=a(l)},function(t,e,o){"use strict";function a(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function r(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}e.__esModule=!0;var i=o(0),s=o(1),c=function(t){function e(o){a(this,e);var r=n(this,t.call(this,o));return r.state={hasHighcharts:window.Highcharts||!1,hasData:!0},r}return r(e,t),e.prototype.loadChartLib=function(){var t=this;return new Promise(function(e,o){if(t.state.hasHighcharts)return void e(t);var a=!1,n=document.getElementsByTagName("script")[0],r=document.createElement("script");r.type="text/javascript",r.src="//s3.glbimg.com/cdn/libs/highcharts/4.2.7/highcharts.js",r.async=!0,r.onload=r.onreadystatechange=function(){a||this.readyState&&"complete"!=this.readyState||(a=!0,e(this))},r.onerror=r.onabort=o,n.parentNode.insertBefore(r,n)})},e.prototype._createChartConfig=function(t){var e=t[0][0],o=t.slice(-1).pop()[0],a=parseFloat(t[0][1]),n=new Date(e);n.setHours(10,0,0,0);var r=(o-(n.getTime()-1e3*n.getTimezoneOffset()*60))/36e5;return{chart:{type:"spline",spacingLeft:12,spacingRight:12,spacingBottom:0,spacingTop:8,animation:{duration:1200}},colors:["negativo"===this.props.tipo?"#c31313":"#6ebf17"],credits:{enabled:!1},navigation:{buttonOptions:!1},xAxis:{tickInterval:36e5,type:"datetime",min:e,labels:{overflow:"right",step:Math.ceil(r),autoRotation:!1,style:{"font-family":"opensans-regular","font-size":"12px",color:"#999"}},dateTimeLabelFormats:{hour:"%Hh"},tickWidth:0,lineWidth:0,gridLineWidth:0,maxPadding:0,startOnTick:!0,endOnTick:!0,tickLength:3,tickmarkPlacement:"on",plotLines:[{id:"time-start",color:"#ccc",dashStyle:"Solid",width:1,value:e,zIndex:0}]},yAxis:{gridLineWidth:0,lineColor:"#999",labels:{enabled:!1},title:{text:null},plotLines:[{id:"limit-open",color:"#333",dashStyle:"Dot",width:1,value:a,zIndex:1}]},legend:{enabled:!1},title:{text:null},tooltip:{headerFormat:"",borderColor:"#e5e5e5",borderRadius:4,pointFormat:"{point.x}<br/><b>{point.y}</b>",formatter:function(){return"Horário: "+window.Highcharts.dateFormat("%Hh%M",new Date(this.x))+"<br/><b>"+this.y+" pontos</b>"}},plotOptions:{spline:{lineWidth:2,marker:{enabled:!1}}},series:[{data:t}]}},e.prototype.renderChart=function(t){window.Highcharts.chart(s.PostName+"__chart",this._createChartConfig(t))},e.prototype.componentDidMount=function(){var t=this;this.state.hasData&&this.loadChartLib().then(function(){var e=void 0;e="http://localhost:8080"==window.location.origin?"https://g1.globo.com/indicadorg1/valor/timeseries/timeseries_bvsp.json":window.location.origin+"/indicadorg1/valor/timeseries/timeseries_bvsp.json",fetch(e).then(function(t){return t.json()}).then(function(e){var o=e.map(function(t){return[t.timestamp,parseInt(Math.round((parseFloat(t.high)+parseFloat(t.low))/2))]});t.renderChart(o),t.setState({hasHighcharts:!0})})}).catch(console.error)},e.prototype.render=function(t,e){return e.hasHighcharts||e.hasData?(0,i.h)("div",{id:s.PostName+"__chart",className:s.PostName+"__chart "+s.PostName+"__chart--filled"}):(0,i.h)("div",{className:s.PostName+"__chart "+s.PostName+"__chart--empty"},"Gráfico indisponível",(0,i.h)("br",null),"no momento")},e}(i.Component);e.default=c},function(t,e,o){"use strict";function a(t){var e=Math.abs(t.value).toLocaleString("pt-BR"),o="",a="";return t.value<0?(a="-",o+=" "+r.PostName+"--negative"):(o+=" "+r.PostName+"--positive",a="+"),(0,n.h)("span",{className:o},(0,n.h)("span",{className:t.symbolClass},a),e,t.children)}e.__esModule=!0,e.default=a;var n=o(0),r=o(1)},function(t,e,o){"use strict";function a(t){var e=t.date.split("/"),o=t.time.split(":"),a=new Date(e[2],parseInt(e[1])-1,e[0],o[0],o[1],o[2],0);return(0,r.h)("p",{className:i.PostName+"__metadata"},"Atualizado ",n((new Date).getTime()-a.getTime()))}function n(t){for(var e=c,o=Array.isArray(e),a=0,e=o?e:e[Symbol.iterator]();;){var n;if(o){if(a>=e.length)break;n=e[a++]}else{if(a=e.next(),a.done)break;n=a.value}var r=n,i=r[0],s=r[1],l=r[2];if(t<i)return 1===l?s:"há "+Math.round(t/l)+" "+s}return""}e.__esModule=!0,e.default=a;var r=o(0),i=o(1),s=864e5,c=[[6e4,"agora",1],[9e4,"há 1 min",1],[36e5,"minutos",6e4],[54e5,"há 1 hora",1],[s,"horas",36e5],[1296e5,"ontem",1],[7*s,"dias",s],[9072e5,"há 1 semana",1],[2628e6,"semanas",6048e5],[3942e6,"há 1 mês",1],[31536e6,"meses",2628e6],[47304e6,"há 1 ano",1],[Number.MAX_VALUE,"anos",31536e6]]}]);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {


// build time: 16/01/2019 14:02:07
// tenant: g1
// env_id: prod
// api_url: http://g1.globo.com

((w, q, s, b, ec, r, c) => {
  s = w.SETTINGS = w.SETTINGS || {};
  b = s.BASTIAN = s.BASTIAN || {};
  ec = b.EXTERNALCOMPONENTS = b.EXTERNALCOMPONENTS || [];

  r = (n, e) => {
    if (e.code === 'MODULE_NOT_FOUND')
      console.error(`[bastian] Feed component '${n}' not found`)
    else
      console.error(`[bastian] [component] [${n}]`, e)
  }

  
    try {
      q.push(__webpack_require__(5));
    } catch (e) {
      r('post-mais-lidas', e);
    }
  
    try {
      q.push(__webpack_require__(6));
    } catch (e) {
      r('post-economia', e);
    }
  
    try {
      q.push(__webpack_require__(7));
    } catch (e) {
      r('post-lista-de-jogos', e);
    }
  
    try {
      q.push(__webpack_require__(3));
    } catch (e) {
      r('post-economia-bolsa', e);
    }
  
    try {
      q.push(__webpack_require__(2));
    } catch (e) {
      r('post-economia-cotacao', e);
    }
  
    try {
      q.push(__webpack_require__(8));
    } catch (e) {
      r('post-mega-sena', e);
    }
  
    try {
      q.push(__webpack_require__(9));
    } catch (e) {
      r('post-loteria-outros-jogos', e);
    }
  
    try {
      q.push(__webpack_require__(10));
    } catch (e) {
      r('post-previsao-do-tempo', e);
    }
  
    try {
      q.push(__webpack_require__(12));
    } catch (e) {
      r('post-lista-de-candidatos', e);
    }
  
    try {
      q.push(__webpack_require__(13));
    } catch (e) {
      r('post-playlist', e);
    }
  
    try {
      q.push(__webpack_require__(15));
    } catch (e) {
      r('post-ficha-de-carro', e);
    }
  
    try {
      q.push(__webpack_require__(16));
    } catch (e) {
      r('post-card-headline', e);
    }
  
    try {
      q.push(__webpack_require__(17));
    } catch (e) {
      r('post-ficha-politico', e);
    }
  
    try {
      q.push(__webpack_require__(18));
    } catch (e) {
      r('post-stories', e);
    }
  
    try {
      q.push(__webpack_require__(19));
    } catch (e) {
      r('post-agrupador-video', e);
    }
  
    try {
      q.push(__webpack_require__(20));
    } catch (e) {
      r('post-agrupador-materia', e);
    }
  
    try {
      q.push(__webpack_require__(21));
    } catch (e) {
      r('post-agrupador-horizontal', e);
    }
  
    try {
      q.push(__webpack_require__(22));
    } catch (e) {
      r('post-editorias-e-assuntos', e);
    }
  

  for (c of q) {
    try {
      ec.push({
        name: c.name,
        renderFn: c.render
      });
    } catch (e) {
      console.error(`[bastian] Failed to register component '${c.name}'\n`, e);
    }
  }
})(window, [])


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(t){function e(n){if(a[n])return a[n].exports;var o=a[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var a={};return e.m=t,e.c=a,e.d=function(t,a,n){e.o(t,a)||Object.defineProperty(t,a,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var a=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(a,"a",a),a},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/Users/leonardo.andrade/projetos/post-mais-lidas/dist",e(e.s=1)}([function(t,e){t.exports=__webpack_require__(0)},function(t,e,a){"use strict";function n(t,e,a){(0,o.render)((0,o.h)(r.default,{data:t,bastianToolkit:a}),e)}Object.defineProperty(e,"__esModule",{value:!0}),e.name=void 0,e.render=n;var o=a(0),i=a(2),r=function(t){return t&&t.__esModule?t:{default:t}}(i);a(4);e.name="post-mais-lidas"},function(t,e,a){"use strict";function n(t){var e=Boolean(t.data),a=Boolean(e&&t.data.externalData),n=Boolean(a&&0==t.data.externalData.length);return e&&a&&!n?(0,r.h)(s.Post,{className:"post-mais-lidas theme"},(0,r.h)(s.Header,null,(0,r.h)(s.Title,null,"Mais Lidas")),(0,r.h)(s.Content,{className:"post-mais-lidas__content"},(0,r.h)("ol",null,t.data.externalData.map(function(e,a){return i({item:e,position:a,bastianToolkit:t.bastianToolkit})})))):null}function o(t){return(0,r.h)("a",t,t.children)}function i(t){var e="clique | "+t.bastianToolkit.getAreaId()+" | noticia "+(t.position+1)+" | sem foto | sem resumo | posicao "+t.bastianToolkit.getItemPosition()+" ";return(0,r.h)(s.Section,{className:"post-mais-lidas__section"},(0,r.h)(l,{href:t.item.content.url,gaCategory:"feed",gaAction:"post mais lidas",gaLabel:e},(0,r.h)("li",{className:"post-mais-lidas__item"},(0,r.h)("span",{className:"gui-color-primary post-mais-lidas__title"},t.item.content.title))))}Object.defineProperty(e,"__esModule",{value:!0});var r=a(0),s=a(3),l=(0,s.withTracking)(o,"onClick",!1);e.default=n},function(t,e){t.exports=__webpack_require__(1)},function(t,e){}]);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(o){function t(n){if(e[n])return e[n].exports;var a=e[n]={i:n,l:!1,exports:{}};return o[n].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var e={};return t.m=o,t.c=e,t.d=function(o,e,n){t.o(o,e)||Object.defineProperty(o,e,{configurable:!1,enumerable:!0,get:n})},t.n=function(o){var e=o&&o.__esModule?function(){return o.default}:function(){return o};return t.d(e,"a",e),e},t.o=function(o,t){return Object.prototype.hasOwnProperty.call(o,t)},t.p="",t(t.s=1)}([function(o,t){o.exports=__webpack_require__(0)},function(o,t,e){"use strict";function n(o,t,e){(0,a.render)((0,a.h)(i.default,{bastianToolkit:e,data:o.externalData}),t)}Object.defineProperty(t,"__esModule",{value:!0}),t.name=void 0,t.render=n;var a=e(0);e(2);var r=e(3),i=function(o){return o&&o.__esModule?o:{default:o}}(r);t.name="post-economia"},function(o,t){},function(o,t,e){"use strict";function n(o){return(0,a.h)(r.Post,{className:"post-economia"},(0,a.h)(r.Header,{className:"post-economia__header"},(0,a.h)(r.Title,null,"Economia"),(0,a.h)("a",{className:"post-economia__logo",title:"Valor",target:"_blank",href:"http://www.valor.com.br/valor-data"})),(0,a.h)(r.Content,{className:"post-economia__content"},(0,a.h)(s.PostSection,{data:o.data,bastianToolkit:o.bastianToolkit,isNotPost:!0}),(0,a.h)(i.PostSection,{data:o.data,bastianToolkit:o.bastianToolkit,isNotPost:!0})),(0,a.h)(r.Footer,null,(0,a.h)(r.Footer.Link,{href:"http://g1.globo.com/economia"},"Tudo sobre economia")))}Object.defineProperty(t,"__esModule",{value:!0}),t.default=n;var a=e(0),r=e(4),i=e(5),s=e(6)},function(o,t){o.exports=__webpack_require__(1)},function(o,t){o.exports=__webpack_require__(2)},function(o,t){o.exports=__webpack_require__(3)}]);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(t){function e(a){if(o[a])return o[a].exports;var n=o[a]={i:a,l:!1,exports:{}};return t[a].call(n.exports,n,n.exports,e),n.l=!0,n.exports}var o={};return e.m=t,e.c=o,e.d=function(t,o,a){e.o(t,o)||Object.defineProperty(t,o,{configurable:!1,enumerable:!0,get:a})},e.n=function(t){var o=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(o,"a",o),o},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=1)}([function(t,e){t.exports=__webpack_require__(0)},function(t,e,o){"use strict";function a(t,e,o){(0,n.render)((0,n.h)(i.default,{data:t,toolkit:o}),e)}Object.defineProperty(e,"__esModule",{value:!0}),e.name=void 0,e.render=a;var n=o(0);o(2);var s=o(3),i=function(t){return t&&t.__esModule?t:{default:t}}(s);e.name="post-lista-de-jogos"},function(t,e){},function(t,e,o){"use strict";function a(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e){for(var o=0;o<e.length;o++){var a=e[o];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(e,o,a){return o&&t(e.prototype,o),a&&t(e,a),e}}(),r=o(0),l=o(4),u=o(5),c=function(t){return t&&t.__esModule?t:{default:t}}(u),p=function(t){function e(){return a(this,e),n(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return s(e,t),i(e,[{key:"render",value:function(t,e){var o=Boolean(t.data),a=Boolean(o&&t.data.externalData),n=Boolean(a&&0==t.data.externalData.length);return o&&a&&!n?(0,r.h)(l.Post,{className:"post-lista-jogos theme"},(0,r.h)(l.Content,null,(0,r.h)(l.Section,null,(0,r.h)("div",{className:"post-lista-jogos__tipo-lista"},t.data.config.parameters.postConteudo),(0,r.h)("section",{className:"post-lista-jogos__tipo-table"},t.data.externalData.map(function(t){return(0,c.default)(t)})),(0,r.h)("div",{className:"post-lista-jogos__mais-jogos"},(0,r.h)("a",{href:"//globoesporte.globo.com/placar-ge/hoje/"},"Mais Jogos",(0,r.h)("span",{className:"post-bastian-products__arrow"},(0,r.h)("svg",{viewBox:"2 2 18 18"},(0,r.h)("path",{d:"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"})))))))):(console.groupCollapsed("Post Lista de Jogos"),console.error("PostListaJogos is null"),console.debug("hasData "+o),console.debug("hasExternalData "+a),console.debug("externalDataIsEmpty "+n),console.debug(t.data.externalData),console.groupEnd(),t.toolkit.implode(),null)}}]),e}(r.Component);e.default=p},function(t,e,o){t.exports=function(t){function e(a){if(o[a])return o[a].exports;var n=o[a]={i:a,l:!1,exports:{}};return t[a].call(n.exports,n,n.exports,e),n.l=!0,n.exports}var o={};return e.m=t,e.c=o,e.d=function(t,o,a){e.o(t,o)||Object.defineProperty(t,o,{configurable:!1,enumerable:!0,get:a})},e.n=function(t){var o=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(o,"a",o),o},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=4)}([function(t,e){t.exports=o(0)},function(t,e,o){"use strict";function a(t,e){var o=[t];return e.className&&o.push(e.className),e.class&&o.push(e.class),o.join(" ")}function n(t){return(0,d.h)("div",{className:a(_.classPrefix,t)},t.children)}function s(t){return(0,d.h)("div",{className:a(_.classPrefix+"__header",t)},t.children)}function i(t){return(0,d.h)("h2",{className:a(_.classPrefix+"__title",t)},t.children)}function r(t){return(0,d.h)("div",{className:a(_.classPrefix+"__content",t)},t.children)}function l(t){return(0,d.h)("section",p({},t,{className:a(_.classPrefix+"__section",t)}),t.children)}function u(t){var e="left"==t.renderThumbnail?"right":"left",o=t.thumbnailFormat?t.thumbnailFormat:"squad",n={device_group:g,"feed-type":"COMPONENTE","post-id":t.post&&t.post.id?t.post.id:"null","post-type":t.post&&t.post.type?t.post.type:"null"};return(0,d.h)(r,{className:"\n        "+a(_.classPrefix+"__content",t)+"\n        post-list--align-"+e+"\n      "},(0,d.h)("ul",null,t.item.map(function(e,a){return(0,d.h)(h.default,{horizonData:Object.assign({"post-url":e.url,"post-has-photo":e.thumbnail?"true":"false"},n,t.horizonData),key:a,position:a+1,renderThumbnail:t.renderThumbnail,bastianToolkit:t.bastianToolkit,thumbnailFormat:o,svg:t.svg,item:e,gaLabel:t.gaLabel,gaAction:t.gaAction})})))}function c(t){return(0,d.h)("footer",{className:a(_.classPrefix+"__footer theme",t)},t.children)}Object.defineProperty(e,"__esModule",{value:!0});var p=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var o=arguments[e];for(var a in o)Object.prototype.hasOwnProperty.call(o,a)&&(t[a]=o[a])}return t};e.Post=n,e.Header=s,e.Title=i,e.Content=r,e.Section=l,e.ListPost=u,e.Footer=c;var d=o(0),_=o(5),f=o(2),h=function(t){return t&&t.__esModule?t:{default:t}}(f),g=window.SETTINGS.BASTIAN.DEVICE_GROUP;c.Link=function(t){return(0,d.h)("a",{className:a(_.classPrefix+"__footer-link",t),href:t.href},t.children,(0,d.h)("span",{className:_.classPrefix+"__arrow"},(0,d.h)("svg",{viewBox:"2 2 18 18"},(0,d.h)("path",{d:"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"}))))}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=o(0),n=o(1),s=o(3),i=function(t){var e=t.thumbnailFormat,o=t.item,n=t.svg;return o.thumbnail?(0,a.h)("div",{className:"post-list__column-right"},(0,a.h)("div",{className:"post-list__column-right__image-"+e},r(n),(0,a.h)("img",{src:o.thumbnail,alt:o.title}))):null},r=function(t){return t?(0,a.h)("svg",{className:"post-list__column-right__image-squad__icon_player",width:"30px",height:"27px",viewBox:"0 0 30 27",version:"1.1"},(0,a.h)("g",{id:"Post-Playlist",stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},(0,a.h)("g",{id:"BBB-AUTOMATICO-Copy",transform:"translate(-258.000000, -604.000000)",fill:"#FFFFFF"},(0,a.h)("g",{id:"Group-2",transform:"translate(16.000000, 315.000000)"},(0,a.h)("g",{id:"Group-8-Copy"},(0,a.h)("g",{id:"Group",transform:"translate(234.000000, 230.000000)"},(0,a.h)("g",{id:"SINALIZACAO"},(0,a.h)("g",{id:"icon",transform:"translate(8.000000, 58.000000)"},(0,a.h)("polygon",{id:"Fill-3",points:"0.934261363 12.3903949 23.4727793 12.3903949 23.4727793 8.63514534 0.934261363 8.63514534"}),(0,a.h)("polygon",{id:"Fill-6",points:"0.934261363 4.87876905 23.4727793 4.87876905 23.4727793 1.12351946 0.934261363 1.12351946"}),(0,a.h)("polygon",{id:"Fill-9",points:"0.934261363 19.9014575 15.9595644 19.9014575 15.9595644 16.1462079 0.934261363 16.1462079"}),(0,a.h)("polygon",{id:"Fill-12",points:"19.7165663 27.413027 29.1078033 21.7795893 19.7165663 16.1461515"}))))))))):null},l=function(t){var e=t.headline;return e?(0,a.h)("div",{className:"post-list__column-left__headline"},(0,a.h)("p",null,e)):null},u=function(t){var e=t.item;return e.title?(0,a.h)("div",{className:"post-list__column-left__title theme"},(0,a.h)("p",null,e.title)):null},c=function(t){var e=t.description;return e?(0,a.h)("div",{className:"post-list__column-left__description"},(0,a.h)("span",null,e)):null},p=function(t){var e=function(t){return(0,a.h)("a",t," ",t.children)},o=(0,s.withTracking)(e,"onClick",!1),r="clique | post 1 | "+t.gaLabel+" | posicao ",p=t.bastianToolkit?"clique | "+t.bastianToolkit.getAreaId()+" | post "+t.position+" | "+t.gaLabel+" | posicao "+t.bastianToolkit.getItemPosition()+" ":r,d=t.bastianToolkit?Object.assign({"post-position":t.bastianToolkit.getItemPosition()+""},t.horizonData):t.horizonData,_=t.item.className||"";return(0,a.h)(n.Section,{className:"post-list__section "+_},(0,a.h)(o,{horizonData:d,href:t.item.url,gaCategory:"feed",gaAction:t.gaAction,gaLabel:p},(0,a.h)("li",{className:"post-list__item"},(0,a.h)("div",{className:"post-list__column-left"},l(t.item),u(t),c(t.item)),i(t))))};e.default=p},function(t,e,o){"use strict";function a(){d||(d=!0,window.requestIdleCallback(n,{timeout:2e3}))}function n(t){for(d=!1,void 0===t&&(t={timeRemaining:function(){return Number.MAX_VALUE}});t.timeRemaining()>0&&p.length>0;)s(p.pop());p.length>0&&a()}function s(t){window.ga(u+"_portal.send","event",t.gaEv_category,t.gaEv_action,t.gaEv_label)}function i(t,e){var o=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return function(a){var n=function(t){var n=a.horizonData;a[e]&&a[e](t),_(a.gaCategory,a.gaAction,a.gaLabel,o),f(n)},s=Object.assign({},a);return s[e]=n,(0,r.h)(t,s,a.children)}}Object.defineProperty(e,"__esModule",{value:!0}),e.sendToHorizon=e.sendToGa=void 0,e.withTracking=i;var r=o(0),l=window.cdaaas.SETTINGS,u=l.SITE_ID,c=l.CANONICAL_URL;window.requestIdleCallback=window.requestIdleCallback||function(t){var e=Date.now();return setTimeout(function(){t({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-e))}})},1)},window.cancelIdleCallback=window.cancelIdleCallback||function(t){clearTimeout(t)};var p=[],d=!1,_=e.sendToGa=function(t,e,o){var n=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],i={gaEv_category:t,gaEv_action:e,gaEv_label:o};n?(p.push(i),a()):s(i)},f=e.sendToHorizon=function(t){window.Horizon.Client().sendPostClick({attributes:t,object:c,product:u})}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=o(1);Object.keys(a).forEach(function(t){"default"!==t&&"__esModule"!==t&&Object.defineProperty(e,t,{enumerable:!0,get:function(){return a[t]}})});var n=o(3);Object.keys(n).forEach(function(t){"default"!==t&&"__esModule"!==t&&Object.defineProperty(e,t,{enumerable:!0,get:function(){return n[t]}})});var s=o(2);Object.keys(s).forEach(function(t){"default"!==t&&"__esModule"!==t&&Object.defineProperty(e,t,{enumerable:!0,get:function(){return s[t]}})}),o(6)},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.classPrefix="post-bastian-products"},function(t,e){}])},function(t,e,o){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}function n(t){return t.transmissao?(0,s.h)("a",{href:t.transmissao.url,className:"post-lista-jogos__tbody"},(0,r.default)(t),(0,u.default)(t)):(0,s.h)("div",{className:"post-lista-jogos__tbody"},(0,r.default)(t),(0,u.default)(t))}Object.defineProperty(e,"__esModule",{value:!0});var s=o(0),i=o(6),r=a(i),l=o(7),u=a(l);e.default=n},function(t,e,o){"use strict";function a(t){var e=n(t.data_realizacao),o=t.hora_realizacao?t.hora_realizacao.slice(0,5):"",a=Boolean(t.transmissao&&"EM_ANDAMENTO"===t.transmissao.status);return(0,i.h)("div",{className:a?"post-lista-jogos__campeonato post-lista-jogos__tr":"post-lista-jogos__campeonato"},a?(0,i.h)("i",{className:"post-lista-jogos__campeonato__tr"},"Tempo Real"):"",(0,i.h)("div",{className:"post-lista-jogos__campeonato--edicao"},(0,i.h)("strong",null,a?"":e)," ",t.campeonato.nome," ",(0,i.h)("strong",null,o)))}function n(t){var e=t.split("-"),o=s(e,3),a=o[0],n=o[1],i=o[2],r=new Date,l=new Date(r.getFullYear(),r.getMonth(),r.getDate()+1);return parseInt(i)===r.getDate()&&parseInt(n)-1===r.getMonth()&&parseInt(a)===r.getFullYear()?"Hoje":parseInt(i)===l.getDate()&&parseInt(n)-1===l.getMonth()&&parseInt(a)===l.getFullYear()?"Amanhã":i+"/"+n}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){var o=[],a=!0,n=!1,s=void 0;try{for(var i,r=t[Symbol.iterator]();!(a=(i=r.next()).done)&&(o.push(i.value),!e||o.length!==e);a=!0);}catch(t){n=!0,s=t}finally{try{!a&&r.return&&r.return()}finally{if(n)throw s}}return o}return function(e,o){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,o);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i=o(0);e.default=a},function(t,e,o){"use strict";function a(t){var e=t.equipe_mandante.escudos.svg||t.equipe_mandante.escudos["60x60"],o=t.equipe_visitante.escudos.svg||t.equipe_visitante.escudos["60x60"];return(0,n.h)("div",{className:"post-lista-jogos__confronto"},(0,n.h)("div",{className:"post-lista-jogos__confronto--placar"},(0,n.h)("picture",{className:"post-lista-jogos__picture post-lista-jogos__picture--mandante"},(0,n.h)("abbr",{className:"post-lista-jogos__org-name post-lista-jogos__org-name--mandante",title:t.equipe_mandante.nome_popular},t.equipe_mandante.sigla),(0,n.h)("img",{className:"post-lista-jogos__org-badge post-lista-jogos__org-badge--mandante",src:e,alt:t.equipe_mandante.nome_popular,onError:function(t){t.target.src="https://s3.glbimg.com/v1/AUTH_378ee63fe83141e69caddd838034e850/static/post-feed/escudo-default.png"}}),(0,n.h)("span",{className:t.placar_penaltis_mandante?"post-lista-jogos__placar--mandante post-lista-jogos__placar--penalti":"post-lista-jogos__placar--mandante"},t.placar_oficial_mandante," ",t.placar_penaltis_mandante?(0,n.h)("small",null,"(",t.placar_penaltis_mandante):"")),(0,n.h)("div",{className:"post-lista-jogos__score"},(0,n.h)("span",{className:"post-lista-jogos__vs-icon"},(0,n.h)("svg",{viewBox:"0 0 100 100",id:"scoreboard-vs-icon",width:"100%",height:"100%"},(0,n.h)("line",{x1:"-3",x2:"100",y1:"1",y2:"100",stroke:"#999","stroke-width":"5"}),(0,n.h)("line",{x1:"-3",x2:"100",y1:"100",y2:"1",stroke:"#999","stroke-width":"5"})))),(0,n.h)("picture",{className:"post-lista-jogos__picture post-lista-jogos__picture--visitante"},(0,n.h)("span",{className:t.placar_penaltis_visitante?"post-lista-jogos__placar--visitante post-lista-jogos__placar--penalti":"post-lista-jogos__placar--visitante"},t.placar_oficial_visitante," ",t.placar_penaltis_visitante?(0,n.h)("small",null,t.placar_penaltis_visitante,")"):""),(0,n.h)("img",{className:"post-lista-jogos__org-badge post-lista-jogos__org-badge--visitante",src:o,alt:t.equipe_visitante.nome_popular,onError:function(t){t.target.src="https://s3.glbimg.com/v1/AUTH_378ee63fe83141e69caddd838034e850/static/post-feed/escudo-default.png"}}),(0,n.h)("abbr",{className:"post-lista-jogos__org-name post-lista-jogos__org-name--visitante",title:t.equipe_visitante.nome_popular},t.equipe_visitante.sigla))))}Object.defineProperty(e,"__esModule",{value:!0});var n=o(0);e.default=a}]);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(e){function t(n){if(a[n])return a[n].exports;var o=a[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var a={};return t.m=e,t.c=a,t.d=function(e,a,n){t.o(e,a)||Object.defineProperty(e,a,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var a=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(a,"a",a),a},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t){e.exports=__webpack_require__(0)},function(e,t,a){"use strict";function n(e,t,a){(0,o.render)((0,o.h)(s.default,{bastianToolkit:a,data:e.externalData}),t)}Object.defineProperty(t,"__esModule",{value:!0}),t.name=void 0,t.render=n;var o=a(0);a(2);var r=a(3),s=function(e){return e&&e.__esModule?e:{default:e}}(r);t.name="post-mega-sena"},function(e,t){},function(e,t,a){"use strict";function n(e){return(0,r.h)("a",e,e.children)}function o(e){var t=e.data.ultimo_concurso,a="clique | "+e.bastianToolkit.getAreaId()+" | anexo | com anexo | sem resumo | posicao "+e.bastianToolkit.getItemPosition();return(0,r.h)(s.Post,{className:"post-mega-sena"},(0,r.h)(i,{href:u,gaCategory:"feed",gaAction:"post mega sena",gaLabel:a},(0,r.h)(s.Content,null,(0,r.h)(s.Section,null,(0,r.h)("div",{className:"post-mega-sena__header"},"Mega Sena"),(0,r.h)("div",{className:"post-mega-sena__resultado"},t.resultado.sort(function(e,t){return e-t}).map(function(e){return(0,r.h)("div",{className:"post-mega-sena__resultado__conteudo"},e)})),(0,r.h)("div",{className:"post-mega-sena__resultado__rodape"},(0,r.h)("p",{className:"post-mega-sena__resultado__rodape-concurso"},"Concurso ",t.numero," - ",function(e){var t=new Date(e),a=t.toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"}).split("de ");return a[1]=a[1].toUpperCase(),a.join("")}(t.data)),(0,r.h)("p",null,function(e){var t=e.ganhadores;return 0===t.length?"Acumulado: R$ "+e.valor_acumulado.toLocaleString("pt-BR"):1===t.length?"1 Ganhador":t.length+" Ganhadores"}(t)))))))}Object.defineProperty(t,"__esModule",{value:!0});var r=a(0),s=a(4),u="https://g1.globo.com/loterias/megasena.ghtml",i=(0,s.withTracking)(n,"onClick",!1);t.default=o},function(e,t){e.exports=__webpack_require__(1)}]);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(o){function e(a){if(t[a])return t[a].exports;var s=t[a]={i:a,l:!1,exports:{}};return o[a].call(s.exports,s,s.exports,e),s.l=!0,s.exports}var t={};return e.m=o,e.c=t,e.d=function(o,t,a){e.o(o,t)||Object.defineProperty(o,t,{configurable:!1,enumerable:!0,get:a})},e.n=function(o){var t=o&&o.__esModule?function(){return o.default}:function(){return o};return e.d(t,"a",t),t},e.o=function(o,e){return Object.prototype.hasOwnProperty.call(o,e)},e.p="",e(e.s=1)}([function(o,e){o.exports=__webpack_require__(0)},function(o,e,t){"use strict";function a(o,e,t){(0,s.render)((0,s.h)(r.default,{bastianToolkit:t,data:o.externalData}),e)}Object.defineProperty(e,"__esModule",{value:!0}),e.name=void 0,e.render=a;var s=t(0);t(2);var n=t(3),r=function(o){return o&&o.__esModule?o:{default:o}}(n);e.name="post-loteria-outros-jogos"},function(o,e){},function(o,e,t){"use strict";function a(o){return(0,i.h)("a",o,o.children)}function s(o){return(0,i.h)(u.Post,{className:"post-loteria-outros-jogos"},(0,i.h)(u.Header,null,(0,i.h)(u.Title,{className:"post-loteria-outros-jogos__titulo"},"Outros jogos")),(0,i.h)(u.Content,null,c.map(function(e){var t=void 0;o.data&&(t=o.data[e.slug]);var a="clique | "+o.bastianToolkit.getAreaId()+" | "+e.slug+" | anexo | com anexo | sem resumo | posicao "+o.bastianToolkit.getItemPosition(),s="https://g1.globo.com/loterias/"+e.slug+".ghtml";return(0,i.h)(u.Section,null,(0,i.h)(g,{href:s,gaCategory:"feed",gaAction:"post loterias outros jogos",gaLabel:a},(0,i.h)("div",{className:"post-loteria-outros-jogos__jogo "+e.slug},(0,i.h)("div",{className:"post-loteria-outros-jogos__jogo-info"},(0,i.h)(l,{slug:e.slug}),(0,i.h)("h2",{className:"post-loteria-outros-jogos__nome-jogo"},e.name)),r(t))))}),(0,i.h)(u.Section,{className:"post-loteria-outros-jogos__footer"},(0,i.h)("div",{className:"post-loteria-outros-jogos__disclaimer"},"Todos os resultados divulgados nesta página são fornecidos pela Caixa Econômica Federal, única responsável pelos sorteios."))))}function n(o){if(o.ganhadores){var e=o.ganhadores;return 0===e.length?"Acumulou!":1===e.length?"1 Ganhador":e.length+" Ganhadores"}if(o.premiacoes){var t=o.premiacoes;return 0===t.length?"Acumulou!":1===t.length?"1 Ganhador":t.length+" Ganhadores"}}function r(o){if(o)return(0,i.h)("div",{className:"post-loteria-outros-jogos__info"},(0,i.h)("span",{className:"post-loteria-outros-jogos__concurso"},"Concurso ",o.numero),(0,i.h)("span",{className:"post-loteria-outros-jogos__ganhadores"},n(o)))}function l(o){return(0,i.h)("div",{className:"post-loteria-outros-jogos__logo "+o.slug},(0,i.h)("svg",{width:"16px",height:"16px",viewBox:"0 0 22 22",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},(0,i.h)("g",{id:"flor-loteca",stroke:"none","stroke-width":"1","fill-rule":"evenodd"},(0,i.h)("path",{d:"M11.1470219,10.6044054 L18.6156781,10.6050969 C20.3113969,10.6044054 21.6908656,9.21739971 21.6912094,7.51199114 C21.6908656,6.68538829 21.3708344,5.908914 20.7898969,5.32431114 C20.2089594,4.740054 19.4365531,4.41853971 18.6153344,4.418194 L17.2980844,4.41853971 L17.2980844,3.09376257 C17.2980844,2.26750543 16.9780531,1.49068543 16.3967719,0.906428286 C15.8161781,0.322171143 15.0441156,0.000656857143 14.2222094,0.000656857143 C12.5264906,0.000311142858 11.1470219,1.38766257 11.1470219,3.09376257 L11.1470219,10.6044054 Z",id:"Fill-1"}),(0,i.h)("path",{d:"M10.5441188,11.2107537 L3.07580625,11.2107537 C1.3800875,11.210408 0.000275,12.5984509 0.00061875,14.3035137 C0.00061875,15.1297709 0.32065,15.9065909 0.90124375,16.490848 C1.48218125,17.0751051 2.2545875,17.3966194 3.07615,17.3969651 L4.3934,17.3973109 L4.3934,18.7217423 C4.3934,19.5476537 4.71343125,20.3244737 5.294025,20.9087309 C5.87530625,21.492988 6.6477125,21.814848 7.469275,21.8151937 C9.16465,21.8151937 10.5444625,20.4271509 10.5444625,18.722088 L10.5441188,11.2107537 Z",id:"Fill-3"}),(0,i.h)("path",{"fill-opacity":"0.4",d:"M17.2982906,17.3974837 L18.6155406,17.397138 C19.4374469,17.397138 20.2095094,17.0756237 20.7904469,16.4910209 C21.3710406,15.9071094 21.6907281,15.1302894 21.6910719,14.304378 C21.6907281,13.4781209 21.3713844,12.7016466 20.7901031,12.1170437 C20.2095094,11.5331323 19.4371031,11.2112723 18.6155406,11.2112723 L11.1468844,11.2105809 L11.1472281,18.7219151 C11.1475719,19.548518 11.4676031,20.3249923 12.0485406,20.9089037 C12.6291344,21.4931609 13.4015406,21.8150209 14.2231031,21.8150209 C15.0443219,21.8150209 15.8163844,21.4931609 16.3976656,20.9089037 C16.9786031,20.3249923 17.2986344,19.548518 17.2986344,18.7219151 L17.2982906,17.3974837 Z",id:"Fill-6"}),(0,i.h)("path",{"fill-opacity":"0.4",d:"M10.5439469,3.09355514 C10.5436031,2.267298 10.2239156,1.490478 9.64297812,0.906220857 C9.06204062,0.321963714 8.28963437,0.000449428571 7.46807187,0.000103714286 C5.77235312,0.000103714286 4.39254062,1.38745514 4.39254062,3.09320943 L4.39288437,4.41798657 L3.07529062,4.41798657 C1.37957187,4.41798657 0.000103125,5.805338 0.000103125,7.51074657 C0.000103125,8.33700371 0.320478125,9.11382371 0.901415625,9.69808086 C1.48200937,10.282338 2.25407187,10.604198 3.07563437,10.6045437 L10.5442906,10.6045437 L10.5439469,3.09355514 Z",id:"Fill-8"}))))}Object.defineProperty(e,"__esModule",{value:!0}),e.default=s;var i=t(0),u=t(4),c=[{slug:"duplasena",name:"Dupla Sena"},{slug:"federal",name:"Federal"},{slug:"loteca",name:"Loteca"},{slug:"lotofacil",name:"Lotofácil"},{slug:"lotogol",name:"Lotogol"},{slug:"lotomania",name:"Lotomania"},{slug:"quina",name:"Quina"},{slug:"timemania",name:"Timemania"}],g=(0,u.withTracking)(a,"onClick",!1)},function(o,e){o.exports=__webpack_require__(1)}]);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(e){function t(n){if(o[n])return o[n].exports;var r=o[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var o={};return t.m=e,t.c=o,t.d=function(e,o,n){t.o(e,o)||Object.defineProperty(e,o,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t){e.exports=__webpack_require__(0)},function(e,t,o){"use strict";function n(e,t,o){(0,r.render)((0,r.h)(i.default,{bastianToolkit:o,content:e.content,config:e.config}),t)}Object.defineProperty(t,"__esModule",{value:!0}),t.name=void 0,t.render=n;var r=o(0);o(2);var a=o(3),i=function(e){return e&&e.__esModule?e:{default:e}}(a);t.name="post-previsao-do-tempo"},function(e,t){},function(e,t,o){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function i(e){return(0,f.h)("a",e,e.children)}function c(e){var t=["Da","Das","De","Do","Dos"],o=e.location.city.name;return o=o.replace(new RegExp("\\b("+t.join("|")+")\\b","g"),function(e){return e.toLowerCase()}),(0,f.h)("div",{className:"post-previsao-do-tempo__header"},o)}function s(e){return(0,f.h)("div",{className:"post-previsao-do-tempo__temperaturas"},(0,f.h)("div",{className:"post-previsao-do-tempo__temperatura"},u({temperature:e.prevision.temperatura.maxima}),(0,f.h)("span",{className:"post-previsao-do-tempo__temperatura--sufixo"},"max")),(0,f.h)("div",{className:"post-previsao-do-tempo__temperatura"},u({temperature:e.prevision.temperatura.minima}),(0,f.h)("span",{className:"post-previsao-do-tempo__temperatura--sufixo"},"min")))}function u(e){return(0,f.h)("span",{className:"post-previsao-do-tempo__temperatura--valor"},e.temperature,"º")}function p(e){var t=e.prevision.chuva;return(0,f.h)("div",{className:"post-previsao-do-tempo__propabilidade-de-chuva"},"Probabilidade de chuva: ",t.probabilidade,"% ",t.precipitacao,"mm")}function l(e){return(0,f.h)("div",{className:"post-previsao-do-tempo__previsao-do-dia"},(0,f.h)("div",{className:"post-previsao-do-tempo__icon post-previsao-do-tempo__icon--"+e.value.codigo}),(0,f.h)("div",null,e.timeOfDay))}Object.defineProperty(t,"__esModule",{value:!0});var d=function(){function e(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,o,n){return o&&e(t.prototype,o),n&&e(t,n),t}}(),f=o(0),m=o(4),v=o(5),h=o(7),g=function(e){return e&&e.__esModule?e:{default:e}}(h),_=o(8),b=(0,_.withTracking)(i,"onClick",!1),y=function(e){function t(){return n(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),d(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.content.geolocalizado;this.getLocation(t).then(function(e){return(0,v.getWeatherPrevisions)(e)}).then(function(o){return e.setState({loaded:!0,previsions:o,geolocalizado:t})}).catch(function(e){return console.error("[Post Previsão do Tempo] Ocorreu um erro ao carregar os dados.",e)})}},{key:"getLocation",value:function(e){var t=void 0,o=this.props.config;if(!0===e||void 0===o||void 0===o.parameters||void 0===o.parameters.data)t=(0,m.loadLocalSdk)().then(function(){return(0,m.getCurrentLocation)()}).catch(function(e){return console.error("[Post Previsão do Tempo] Ocorreu um erro ao carregar a geolocalização.",e)});else{var n=(0,m.Location)(this.props.config.parameters.data.state,this.props.config.parameters.data.city_name,this.props.config.parameters.data.city_code,this.props.config.parameters.data.city_uri);t=Promise.resolve(n)}return t}},{key:"render",value:function(e,t){if(!t.loaded)return(0,g.default)();var o=t.previsions.location,n=t.previsions.previsions[0],r="clique | "+e.bastianToolkit.getAreaId()+" | anexo | com anexo | sem resumo | posicao "+e.bastianToolkit.getItemPosition();return(0,f.h)(_.Post,{className:"post-previsao-do-tempo"},(0,f.h)(_.Content,null,(0,f.h)(_.Section,null,(0,f.h)(b,{href:"/previsao-do-tempo/"+o.city.slug+".html",gaCategory:"feed",gaAction:"post tempo",gaLabel:r},c({location:o}),p({prevision:n}),(0,f.h)("div",{className:"post-previsao-do-tempo__previsao"},l({value:n.dia.manha,timeOfDay:"manhã"}),l({value:n.dia.tarde,timeOfDay:"tarde"}),l({value:n.dia.noite,timeOfDay:"noite"}),s({prevision:n}))))))}}]),t}(f.Component);t.default=y},function(e,t,o){"use strict";function n(e,t,o,n){return{state:e,city:{name:t,uri:n,slug:e.toLowerCase()+"/"+o}}}function r(e){return n(e.state.code,e.city.name,e.city.code,e.semantic.uri)}function a(){return new Promise(function(e,t){if(!window.glb||!window.glb.local)return void e(c);window.glb.local.getLocation({success:function(t){e(t&&t.extra&&t.city?r(t):c)},error:function(){return e(c)}})})}function i(){var e=this;return new Promise(function(t,o){if(window.glb&&window.glb.local)return void t(e);var n=!1,r=document.getElementsByTagName("script")[0],a=document.createElement("script");a.type="text/javascript",a.src="//s3.glbimg.com/cdn/glb-local/stable/glb.local.min.js",a.async=!0,a.onload=a.onreadystatechange=function(){n||this.readyState&&"complete"!=this.readyState||(n=!0,t(this))},a.onerror=a.onabort=o,r.parentNode.insertBefore(a,r)})}Object.defineProperty(t,"__esModule",{value:!0}),t.Location=n,t.getCurrentLocation=a,t.loadLocalSdk=i;var c=n("SP","São Paulo","sao-paulo","http://semantica.globo.com/base/Cidade_Sao_Paulo_SP")},function(e,t,o){"use strict";function n(e){var t="https://api.g1.globo.com/v2/tempo/cidade/"+e.city.uri+".jsonp";return new Promise(function(o,n){(0,a.default)(t,{jsonpCallbackFunction:"g1_previsao_cidade"}).then(function(e){return e.json()}).then(function(t){return o({location:e,previsions:t})}).catch(function(e){return n(e)})})}Object.defineProperty(t,"__esModule",{value:!0}),t.getWeatherPrevisions=n;var r=o(6),a=function(e){return e&&e.__esModule?e:{default:e}}(r)},function(e,t,o){var n,r,a;!function(o,i){r=[t,e],n=i,void 0!==(a="function"==typeof n?n.apply(t,r):n)&&(e.exports=a)}(0,function(e,t){"use strict";function o(){return"jsonp_"+Date.now()+"_"+Math.ceil(1e5*Math.random())}function n(e){try{delete window[e]}catch(t){window[e]=void 0}}function r(e){var t=document.getElementById(e);t&&document.getElementsByTagName("head")[0].removeChild(t)}function a(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],a=e,c=t.timeout||i.timeout,s=t.jsonpCallback||i.jsonpCallback,u=void 0;return new Promise(function(i,p){var l=t.jsonpCallbackFunction||o(),d=s+"_"+l;window[l]=function(e){i({ok:!0,json:function(){return Promise.resolve(e)}}),u&&clearTimeout(u),r(d),n(l)},a+=-1===a.indexOf("?")?"?":"&";var f=document.createElement("script");f.setAttribute("src",""+a+s+"="+l),t.charset&&f.setAttribute("charset",t.charset),f.id=d,document.getElementsByTagName("head")[0].appendChild(f),u=setTimeout(function(){p(new Error("JSONP request to "+e+" timed out")),n(l),r(d),window[l]=function(){n(l)}},c),f.onerror=function(){p(new Error("JSONP request to "+e+" failed")),n(l),r(d),u&&clearTimeout(u)}})}var i={timeout:5e3,jsonpCallback:"callback",jsonpCallbackFunction:null};t.exports=a})},function(e,t){e.exports=__webpack_require__(11)},function(e,t){e.exports=__webpack_require__(1)}]);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n(1);var r=n(2),o=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default=o.default},function(e,t){},function(e,t,n){"use strict";function r(e){return(0,u.h)(s.Post,{className:"post-skeleton"},(0,u.h)(s.Content,null,(0,u.h)(s.Section,null,o({size:"S"}),o({size:"L"}),o({size:"XL"}),o({size:"M"}))))}function o(e){return(0,u.h)("div",{className:"post-skeleton__rect post-skeleton__rect--animated post-skeleton__rect--"+e.size})}Object.defineProperty(t,"__esModule",{value:!0}),t.default=r;var u=n(3),s=n(4)},function(e,t){e.exports=__webpack_require__(0)},function(e,t){e.exports=__webpack_require__(1)}]);

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t){e.exports=__webpack_require__(0)},function(e,t,n){e.exports=function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=4)}([function(e,t){e.exports=n(0)},function(e,t,n){"use strict";function o(e,t){var n=[e];return t.className&&n.push(t.className),t.class&&n.push(t.class),n.join(" ")}function r(e){return(0,f.h)("div",{className:o(p.classPrefix,e)},e.children)}function a(e){return(0,f.h)("div",{className:o(p.classPrefix+"__header",e)},e.children)}function i(e){return(0,f.h)("h2",{className:o(p.classPrefix+"__title",e)},e.children)}function s(e){return(0,f.h)("div",{className:o(p.classPrefix+"__content",e)},e.children)}function c(e){return(0,f.h)("section",d({},e,{className:o(p.classPrefix+"__section",e)}),e.children)}function l(e){var t="left"==e.renderThumbnail?"right":"left",n=e.thumbnailFormat?e.thumbnailFormat:"squad";return(0,f.h)(s,{className:"\n        "+o(p.classPrefix+"__content",e)+"\n        post-list--align-"+t+"\n      "},(0,f.h)("ul",null,e.item.map(function(t,o){return(0,f.h)(_.default,{key:o,position:o+1,renderThumbnail:e.renderThumbnail,bastianToolkit:e.bastianToolkit,thumbnailFormat:n,svg:e.svg,item:t,gaLabel:e.gaLabel,gaAction:e.gaAction})})))}function u(e){return(0,f.h)("footer",{className:o(p.classPrefix+"__footer theme",e)},e.children)}Object.defineProperty(t,"__esModule",{value:!0});var d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};t.Post=r,t.Header=a,t.Title=i,t.Content=s,t.Section=c,t.ListPost=l,t.Footer=u;var f=n(0),p=n(5),h=n(2),_=function(e){return e&&e.__esModule?e:{default:e}}(h);u.Link=function(e){return(0,f.h)("a",{className:o(p.classPrefix+"__footer-link",e),href:e.href},e.children,(0,f.h)("span",{className:p.classPrefix+"__arrow"},(0,f.h)("svg",{viewBox:"2 2 18 18"},(0,f.h)("path",{d:"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"}))))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),r=n(1),a=n(3),i=function(e){var t=e.thumbnailFormat,n=e.item,r=e.svg;return n.thumbnail?(0,o.h)("div",{className:"post-list__column-right"},(0,o.h)("div",{className:"post-list__column-right__image-"+t},s(r),(0,o.h)("img",{src:n.thumbnail,alt:n.title}))):null},s=function(e){return e?(0,o.h)("svg",{className:"post-list__column-right__image-squad__icon_player",width:"30px",height:"27px",viewBox:"0 0 30 27",version:"1.1"},(0,o.h)("g",{id:"Post-Playlist",stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},(0,o.h)("g",{id:"BBB-AUTOMATICO-Copy",transform:"translate(-258.000000, -604.000000)",fill:"#FFFFFF"},(0,o.h)("g",{id:"Group-2",transform:"translate(16.000000, 315.000000)"},(0,o.h)("g",{id:"Group-8-Copy"},(0,o.h)("g",{id:"Group",transform:"translate(234.000000, 230.000000)"},(0,o.h)("g",{id:"SINALIZACAO"},(0,o.h)("g",{id:"icon",transform:"translate(8.000000, 58.000000)"},(0,o.h)("polygon",{id:"Fill-3",points:"0.934261363 12.3903949 23.4727793 12.3903949 23.4727793 8.63514534 0.934261363 8.63514534"}),(0,o.h)("polygon",{id:"Fill-6",points:"0.934261363 4.87876905 23.4727793 4.87876905 23.4727793 1.12351946 0.934261363 1.12351946"}),(0,o.h)("polygon",{id:"Fill-9",points:"0.934261363 19.9014575 15.9595644 19.9014575 15.9595644 16.1462079 0.934261363 16.1462079"}),(0,o.h)("polygon",{id:"Fill-12",points:"19.7165663 27.413027 29.1078033 21.7795893 19.7165663 16.1461515"}))))))))):null},c=function(e){var t=e.headline;return t?(0,o.h)("div",{className:"post-list__column-left__headline"},(0,o.h)("p",null,t)):null},l=function(e){var t=e.item;return t.title?(0,o.h)("div",{className:"post-list__column-left__title theme"},(0,o.h)("p",null,t.title)):null},u=function(e){var t=e.description;return t?(0,o.h)("div",{className:"post-list__column-left__description"},(0,o.h)("span",null,t)):null},d=function(e){var t=function(e){return(0,o.h)("a",e," ",e.children)},n=(0,a.withTracking)(t,"onClick",!1),s="clique | post 1 | "+e.gaLabel+" | posicao ",d=e.bastianToolkit?"clique | "+e.bastianToolkit.getAreaId()+" | post "+e.position+" | "+e.gaLabel+" | posicao "+e.bastianToolkit.getItemPosition()+" ":s;return(0,o.h)(r.Section,{className:"post-list__section"},(0,o.h)(n,{href:e.item.url,gaCategory:"feed",gaAction:e.gaAction,gaLabel:d},(0,o.h)("li",{className:"post-list__item"},(0,o.h)("div",{className:"post-list__column-left"},c(e.item),l(e),u(e.item)),i(e))))};t.default=d},function(e,t,n){"use strict";function o(){l||(l=!0,window.requestIdleCallback(r,{timeout:2e3}))}function r(e){for(l=!1,void 0===e&&(e={timeRemaining:function(){return Number.MAX_VALUE}});e.timeRemaining()>0&&c.length>0;)a(c.pop());c.length>0&&o()}function a(e){window.ga(window.cdaaas.SETTINGS.SITE_ID+"_portal.send","event",e.gaEv_category,e.gaEv_action,e.gaEv_label)}function i(e,t){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return function(o){var r=function(e){o[t]&&o[t](e),u(o.gaCategory,o.gaAction,o.gaLabel,n)},a=Object.assign({},o);return a[t]=r,(0,s.h)(e,a,o.children)}}Object.defineProperty(t,"__esModule",{value:!0}),t.sendToGa=void 0,t.withTracking=i;var s=n(0);window.requestIdleCallback=window.requestIdleCallback||function(e){var t=Date.now();return setTimeout(function(){e({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-t))}})},1)},window.cancelIdleCallback=window.cancelIdleCallback||function(e){clearTimeout(e)};var c=[],l=!1,u=t.sendToGa=function(e,t,n){var r=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],i={gaEv_category:e,gaEv_action:t,gaEv_label:n};r?(c.push(i),o()):a(i)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(1);Object.keys(o).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return o[e]}})});var r=n(3);Object.keys(r).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return r[e]}})});var a=n(2);Object.keys(a).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return a[e]}})}),n(6)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.classPrefix="post-bastian-products"},function(e,t){}])},function(e,t,n){"use strict";function o(e,t,n){(0,r.render)((0,r.h)(i.default,{bastianToolkit:n,data:e.externalData,content:e.content}),t)}Object.defineProperty(t,"__esModule",{value:!0}),t.name=void 0,t.render=o;var r=n(0);n(3);var a=n(4),i=function(e){return e&&e.__esModule?e:{default:e}}(a);t.name="post-lista-de-candidatos"},function(e,t){},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function i(e){return(0,d.h)("a",e,e.children)}function s(e,t){var n=e.nome.toUpperCase(),o=t.nome.toUpperCase();return n<o?-1:n>o?1:0}function c(e){return e.replace(/\w\S*/g,function(e){return e.charAt(0).toUpperCase()+e.substr(1).toLowerCase()})}function l(e){var t=e.state.toLowerCase(),n=v+"/jo/el/2018/apuracao/1-turno/"+t+"/executivo.json";return fetch(n).then(function(e){return e.ok?e.json():Promise.reject("HTTPError: "+n+" returned "+e.status)}).catch(function(e){return Promise.reject(e)})}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),d=n(0),f=n(5),p=n(6),h=function(e){return e&&e.__esModule?e:{default:e}}(p),_=n(1),m=(0,_.withTracking)(i,"onClick",!1),g=function(e){function t(){return o(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"componentWillMount",value:function(){var e=this,t=this.props.content.geolocalizado;t?(0,f.loadLocalSdk)().then(function(){return(0,f.getCurrentLocation)()}).then(function(e){return l(e)}).then(function(n){return e.setState({loaded:!0,data:n,geolocalizado:t})}).catch(function(e){return console.error("[Post Lista de Candidatos] Ocorreu um erro ao carregar os dados. \n",e)}):this.setState({loaded:!0,geolocalizado:t})}},{key:"render",value:function(e,t){function n(e){return e+i}if(!t.loaded)return(0,h.default)();var o=t.geolocalizado?t.data:e.data,r=o.abrangencia,a=o.candidatos,i=a.length>7?" small-size":"";return a.sort(s),(0,d.h)(_.Post,{className:"post-lista-de-candidatos"},(0,d.h)(_.Header,null,(0,d.h)(_.Title,{className:"post-lista-de-candidatos__titulo"},function(e){return"BR"==e.key?"Candidatos a Presidente":e.key+" - Candidatos a Governador"}(r))),(0,d.h)(_.Content,{className:"post-lista-de-candidatos__content"},a.map(function(e){var t=e.nome,o=e.partido,r=e.foto,a=e.numero,i=e.politicoUrl;return(0,d.h)(_.Section,{className:n("post-lista-de-candidatos__section")},(0,d.h)(m,{href:i},(0,d.h)("div",{className:n("post-lista-de-candidatos__candidato")},(0,d.h)("div",{className:"post-lista-de-candidatos__candidato-info"},(0,d.h)("p",{className:n("post-lista-de-candidatos__candidato-nome")},c(t)),(0,d.h)("p",{className:n("post-lista-de-candidatos__candidato-partido")},o,"  •  ",a)),(0,d.h)("div",{className:n("post-lista-de-candidatos__candidato-foto")},(0,d.h)("img",{src:r})))))})),function(e){if("BR"!==e.key){var t=window.location.origin+"/politica/eleicoes/2018/"+e.key.toLowerCase()+"/candidatos/senador.ghtml";return(0,d.h)(_.Footer,{className:"post-lista-de-candidatos__footer"},(0,d.h)(_.Footer.Link,{href:t},"Veja lista de senadores"))}}(r))}}]),t}(d.Component),v=window.location.origin.includes("qa")?"https://s.glbimg.qa.globoi.com":"https://s.glbimg.com";t.default=g},function(e,t,n){"use strict";function o(e,t,n,o,r,a,i){return{country:e,state:t,region:{name:n,path:o},city:{name:r,uri:a,slug:i}}}function r(e){return o(e.country.code,e.state.code,e.extra.region_name,e.extra.region_news_path,e.city.name,e.extra.city_uri,e.state.code.toLowerCase()+"/"+e.city.code)}function a(){return new Promise(function(e,t){if(!window.glb||!window.glb.local)return void e(s);window.glb.local.getLocation({success:function(t){t&&t.extra&&t.city&&t.state&&t.country&&"BR"===t.country.code?e(r(t)):(console.log("[Post Lista de Candidatos] Resolve SAO_PAULO"),e(s))},error:function(){return e(s)}})})}function i(){var e=this;return new Promise(function(t,n){if(window.glb&&window.glb.local)return void t(e);var o=!1,r=document.getElementsByTagName("script")[0],a=document.createElement("script");a.type="text/javascript",a.src=c,a.async=!0,a.onload=a.onreadystatechange=function(){o||this.readyState&&"complete"!=this.readyState||(o=!0,t(this))},a.onerror=a.onabort=n,r.parentNode.insertBefore(a,r)})}Object.defineProperty(t,"__esModule",{value:!0}),t.getCurrentLocation=a,t.loadLocalSdk=i;var s=o("BR","SP","São Paulo","sao-paulo","São Paulo","http://semantica.globo.com/base/Cidade_Sao_Paulo_SP"),c="//s3.glbimg.com/cdn/glb-local/stable/glb.local.min.js"},function(e,t,n){e.exports=function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n(1);var o=n(2),r=function(e){return e&&e.__esModule?e:{default:e}}(o);t.default=r.default},function(e,t){},function(e,t,n){"use strict";function o(e){return(0,a.h)(i.Post,{className:"post-skeleton"},(0,a.h)(i.Content,null,(0,a.h)(i.Section,null,r({size:"S"}),r({size:"L"}),r({size:"XL"}),r({size:"M"}))))}function r(e){return(0,a.h)("div",{className:"post-skeleton__rect post-skeleton__rect--animated post-skeleton__rect--"+e.size})}Object.defineProperty(t,"__esModule",{value:!0}),t.default=o;var a=n(3),i=n(4)},function(e,t){e.exports=n(0)},function(e,t){e.exports=n(1)}])}]);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(e){function t(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t){e.exports=__webpack_require__(0)},function(e,t,n){"use strict";function i(e,t,n){(0,o.render)((0,o.h)(a.default,{data:e,toolkit:n}),t)}Object.defineProperty(t,"__esModule",{value:!0}),t.name=void 0,t.render=i;var o=n(0);n(2),n(3);var r=n(4),a=function(e){return e&&e.__esModule?e:{default:e}}(r);t.name="post-playlist"},function(e,t){},function(e,t){},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),l=n(0),c=n(5),u=n(6),p=n(7),d={postType:"playlist",controlGroupName:"control",flow:"gshow-postplaylist-flow",globoABServer:-1!==window.location.origin.indexOf(".qa.")?"https://globo-ab.qa.globoi.com":"https://globo-ab.globo.com"},v=function(e){function t(e){i(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.playlist=n.props.data.externalData?n.props.data.externalData.playlist:null,n.onClick=n.clickHandler.bind(n),n.globoAB=(0,u.globoAB)(),n.globoAB.v2.server=d.globoABServer,n.setState({experiments:{flow:{group:d.controlGroupName,testId:null}}}),n}return r(t,e),s(t,[{key:"_prepareExperiment",value:function(e){var t=this,n=Object.assign({},this.state),i={skipImpression:!0},o=function(i){n.experiments[e].group=i.alternative,n.experiments[e].testId=i.testId,t.setState(n)},r=function(i){n.experiments[e].group=d.controlGroupName,t.setState(n)};this.globoAB.v2.get(d[e],i,o,r)}},{key:"prepareFlowExperiment",value:function(){this.playlist.videos&&this._prepareExperiment("flow")}},{key:"getRelativeImageUrl",value:function(e){return e.replace("http://","https://")}},{key:"formatLabel",value:function(){var e=this.playlist.videoQuantity||this.playlist.videos.length;return e+" "+(e>1?"vídeos":"vídeo")}},{key:"_recordExperiment",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this,i={experiment:d[e],alternative:n.state.experiments[e].group,testId:n.state.experiments[e].testId};null!=n.state.experiments[e].testId&&("conversion"===t?n.globoAB.v2.recordConversion(i):n.globoAB.v2.recordImpression(i))}},{key:"clickHandler",value:function(e){this._recordExperiment("flow","impression"),!(this.state.experiments.flow.group==d.controlGroupName)&&"smart"===window.SETTINGS.BASTIAN.DEVICE_GROUP&&(0,p.flow)({testAB:a({},this.state.experiments.flow,{globoAB:this.globoAB}),id:this.props.data.id,url:this.props.data.content.url,title:this.playlist.title,thumbnail:this.playlist.playlistThumbnail,videos:this.playlist.videos})}},{key:"gotImpression",value:function(e,t){return function(){t._recordExperiment(e,"impression",t)}}},{key:"componentDidMount",value:function(){this.globoAB&&this.globoAB.v2&&this.playlist&&this.prepareFlowExperiment()}},{key:"render",value:function(){var e=this,t=!(this.state.experiments.flow.group==d.controlGroupName),n={title:this.props.data.content.title,summary:this.playlist?this.playlist.caption:this.props.data.content.summary,toolkit:this.props.toolkit,url:this.props.data.content.url,specialBehaviour:t,metadata:{age:this.props.data.age,categoryName:this.props.data.content.section}},i="";try{i=this.props.data.content.image.url}catch(e){return}var o={mediaType:d.postType,badgeLabel:this.playlist?this.formatLabel():"",thumbnail:this.playlist?this.playlist.videos.map(function(e){return e.thumbnail}):this.getRelativeImageUrl(i)},r=Object.assign({},n,o);return(0,l.h)("div",{className:"post-playlist",onClick:this.onClick,ref:function(t){return e.playlistNode=t}},(0,l.h)(c.MediaPost,r))}}]),t}(l.Component);t.default=v},function(e,t){e.exports=__webpack_require__(14)},function(e,t,n){"use strict";t.globoAB=function(){function e(e,t){e&&e(t)}var t={};t.v2={};var n={};return t.test&&(t.v2.internals=n),t.v2.server=t.v2.server||"",n.Experiment=function(){function e(e){for(key in e){var t=e[key];this[key]=t}}return e.prototype.recordImpression=function(){t.v2.recordImpression(this)},e.prototype.recordConversion=function(){t.v2.recordConversion(this)},e}(),n.isCompatibleWithPlugin=function(){return!!window.chrome&&!!window.chrome.webstore},n.getDocumentLocationSearch=function(){return document.location.search},n.getPluginParams=function(){var e={},t=["ab-client-context","ab-client-experiment","ab-client-alternative"],o=n.getDocumentLocationSearch().substr(1).split("&");for(i in o){var r=o[i].split("=");t.indexOf(r[0])>-1&&(e[r[0]]=r[1])}return e},n.getExperimentSettings=function(e,t){var i=n.getPluginParams();if(e&&i["ab-client-context"]===e&&i["ab-client-experiment"]){var o={experiment:i["ab-client-experiment"],alternative:i["ab-client-alternative"]};return o.alternative||delete o.alternative,o}return t&&i["ab-client-experiment"]===t&&i["ab-client-alternative"]?{alternative:i["ab-client-alternative"]}:{}},n.interceptParams=function(e,t){try{if(n.isCompatibleWithPlugin()&&e){var i=void 0,o=void 0;if(e.indexOf("/location/")>-1){var r=e.split("/");i=r[r.length-1]}else e.indexOf("selected-alternatives")>-1&&(o=t.experiments);if(o||i)return Object.assign({},t,n.getExperimentSettings(i,o))}}catch(e){console.error(e)}return t},t.v2.get=function(n,i,o){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){},a={};i&&void 0!==i.skipImpression&&(a.skipImpressions=i.skipImpression);var s=function(t){e(o,t.experiments[n])};t.v2.getMulti([n],a,s,r)},t.v2.getMulti=function(e,t,i){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){},r=e.join(",");n.getSelectedAlternatives("experiments",r,t,i,o)},t.v2.recordImpression=function(e){n.recordMetric("impression",e)},t.v2.recordConversion=function(e){n.recordMetric("conversion",e)},t.v2.getLocation=function(t,i,o){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){};void 0===i&&(i={}),void 0!==i.skipImpression&&(i.countImpressions=!i.skipImpression,delete i.skipImpression),i.drawed=!0;var a=function(t){var i=JSON.parse(t.responseText),r={};for(var a in i){var s=i[a];s.experiment=a,delete s.canCountImpression,delete s.canCountConversion,r=new n.Experiment(s)}e(o,r)};n.doRequest("GET","/ab/location/"+t,i,null,a,r)},n.recordMetric=function(e,t){var i="/v2/tests/"+t.testId+"/"+e,o={experiment:t.experiment,alternative:t.alternative};n.doRequest("PUT",i,null,o)},n.getSelectedAlternatives=function(t,i,o,r){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:function(){};o=o||{},o[t]=i;var s=function(t){var i=JSON.parse(t.responseText),o={};for(var a in i.experiments){var s=i.experiments[a],l=new n.Experiment(s);o[a]=l}i.experiments=o,e(r,i)};n.doRequest("GET","/v2/selected-alternatives",o,null,s,a)},n.doRequest=function(i,o,r,a,s,l){var c="",u=n.interceptParams(o,r);for(var p in u)c+="&"+p+"="+u[p];c&&(c="?"+c.substring(1));var d=t.v2.server+o+c,v=n.creatXHR();v.open(i,d,!0),v.onload=function(){v.status>=200&&v.status<400?e(s,v):e(l,v)},v.onerror=function(t){e(l,t)},v.ontimeout=function(t){e(l,t)},a&&(v.setRequestHeader("Content-Type","application/json;charset=utf-8"),a=JSON.stringify(a)),v.send(a)},n.creatXHR=function(){var e=new XMLHttpRequest;return e.withCredentials=!0,e.timeout=500,e},t}},function(e,t){e.exports=function(e){function t(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=arguments,o=t.removeClass=function(e,t){e.classList.remove(t)},r=t.addClass=function(e,t){e.classList.add(t)};t.toggleClass=function(e,t){e.classList.contains(t)?o(e,t):r(e,t)},t.createElement=function(e,t,n){var i=document.createElement(e);return i.className=t,n&&(i.innerHTML=n),i},t.outerWidth=function(){return window.outerWidth>0?window.outerWidth:document.body.getBoundingClientRect().width},t.getVideoSize=function(e,t){var n={width:e,height:e/(16/9)};return"inline"===t?"width: "+n.width+"px; height: "+n.height+"px;":n},t.debounce=function(e,t,n){var o=void 0;return function(){var r=i,a=function(){o=null,n||e.apply(void 0,r)},s=n&&!o;clearTimeout(o),o=setTimeout(a,t),s&&e.apply(void 0,r)}},t.isInViewport=function(e){var t=e.getBoundingClientRect(),n=document.documentElement;return t.top>=0&&t.left>=0&&t.bottom<=(window.innerHeight||n.clientHeight)&&t.right<=(window.innerWidth||n.clientWidth)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.flow=void 0;var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e};n(2);var o=n(3),r=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(0),s="playlist-flow-video";window.PLAYLIST_FLOW={};var l=function(){var e=window.testABflow;e&&e.testId&&!e.alreadyConverted&&e.globoAB.v2.recordConversion({experiment:"gshow-postplaylist-flow",alternative:e.group,testId:e.testId}),window.testABflow.alreadyConverted=!0},c=function(){window.PLAYLIST_FLOW.active.finished=!0;var e=window.PLAYLIST_FLOW.container,t=window.PLAYLIST_FLOW.active.parent,n=t.nextElementSibling;n&&(n.getElementsByClassName("playlist-flow-video-thumbnail")[0].click(),e.scrollTop=n.offsetTop)},u=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return i({},(0,a.getVideoSize)((0,a.outerWidth)()),{videosIDs:e,autoPlay:t,onPlay:function(){l()},complete:function(){c()}})},p=function(e,t){e.hasAttribute("data-close")&&(window.history.back(1),d(t)),e.hasAttribute("data-expand")&&(0,a.toggleClass)(e.parentNode,"--expanded")},d=function(e){window.PLAYLIST_FLOW.stopActive(),(0,a.addClass)(e,"--hidden"),document.documentElement.classList.remove("--playlist-flow-active"),e.removeEventListener("click",v),window.removeEventListener("popstate",f),window.removeEventListener("resize",h)},v=function(e){var t=e.target,n=e.currentTarget,i=t.hasAttribute("data-thumbnail")?t:t.parentNode,o=i.nextElementSibling,r=i.parentNode.parentNode,a=r.dataset.videoId,s=u(a,!0);p(t,n),a&&window.PLAYLIST_FLOW.setActive({id:a,stage:o,cover:i,parent:r},s)},f=function(e){var t=window.PLAYLIST_FLOW.container;d(t)},h=function(e){var t=(0,a.outerWidth)(),n=(0,a.getVideoSize)(t),i=window.PLAYLIST_FLOW.container;i.querySelectorAll("."+s+"-header").forEach(function(e){e.style.width=n.width+"px",e.style.height=n.height+"px"}),i.querySelectorAll("."+s+"-stage").forEach(function(e){e.style.width=n.width+"px",e.style.height=n.height+"px"}),window.PLAYLIST_FLOW.active.id&&window.PLAYLIST_FLOW.resizeActive(n)},m=function(e){window.PLAYLIST_FLOW=new r.default(e)},y=function(e){for(var t=e.videos,n=(0,a.getVideoSize)((0,a.outerWidth)(),"inline"),i=t.length,o="",r=0;r<i;r++)o+=function(e,t){var o=e.id,r=e.thumbnail,a=e.title,l=e.description;return e.date,'\n      <div class="'+s+'" data-video-id="'+(o||"")+'">\n        <div class="'+s+'-header" style="'+n+'">\n          <picture class="'+s+'-thumbnail" data-thumbnail>\n            <img src="'+(r||"")+'" />\n          </picture>\n          <div class="'+s+'-stage" style="'+n+'"></div>\n        </div>\n        <div class="'+s+'-content">\n          <button class="'+s+'-expand" data-expand></button>\n          <div class="'+s+'-info">\n            <span class="'+s+'-count">'+(t+1)+" de "+i+'</span>\n          </div>\n          <span class="'+s+'-title">'+(a||"")+'</span>\n          <p class="'+s+'-description">'+(l||"")+"</p>\n        </div>\n      </div>\n    "}(t[r],r);return'\n    <button class="playlist-flow-close" data-close></button>\n    <div class="playlist-flow-container">\n      '+o+"\n    </div>\n  "},w=function(e){var t=window.PLAYLIST_FLOW.container,n=document.body,i=void 0;return t?(setTimeout(function(){t.scrollTop=0},.1),t.innerHTML=y(e),m(t),t):(i=(0,a.createElement)("div","playlist-flow",y(e)),n.appendChild(i),m(i),i)};t.flow=function(e){var t=e.testAB;window.testABflow=t;var n=w(e);document.documentElement.classList.add("--playlist-flow-active"),(0,a.removeClass)(n,"--hidden"),window.history.pushState({playlistFlow:"active"},""),h(),n.addEventListener("click",v),window.addEventListener("popstate",f),window.addEventListener("resize",h)}},function(e,t){},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=n(0),s=function(){function e(t){i(this,e),this.container=t,this.stored={},this.player=window.PLAYLIST_FLOW.player?window.PLAYLIST_FLOW.player:new window.WM.Player,this.active={id:"",stage:null,cover:null,parent:null,resumeAt:0,finished:!1}}return r(e,[{key:"setActive",value:function(e,t){this._resetABConvertedFlag(),this._setPlayedTime(),this._storeVideo(),this.active.parent&&(0,a.removeClass)(this.active.parent,"--active"),this._retrieveVideo(e),this._updatePlayer(o({resumeAt:this.active.resumeAt},t)),this.active.parent&&(0,a.addClass)(this.active.parent,"--active")}},{key:"stopActive",value:function(){this.player.stopVideo(),this.active.parent&&(0,a.removeClass)(this.active.parent,"--active")}},{key:"resizeActive",value:function(e){this.player.resize(e)}},{key:"_storeVideo",value:function(){this.active.id&&(this.stored[this.active.id]=Object.assign({},this.active))}},{key:"_retrieveVideo",value:function(e){var t=this.stored[e.id]||o({},e,{resumeAt:0,finished:!1});this.active=Object.assign({},t)}},{key:"_setPlayedTime",value:function(){this.active.finished?(this.active.resumeAt=0,this.active.finished=!1):this.active.resumeAt=this.player.getCurrentTime()||0}},{key:"_resetABConvertedFlag",value:function(){window.testABflow&&(window.testABflow.alreadyConverted=!1)}},{key:"_updatePlayer",value:function(e){this.player.stopVideo(),this.player.configure(e),this.player.attachTo(this.active.stage)}}]),e}();t.default=s}])}]);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(e){function t(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t){e.exports=__webpack_require__(0)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2);Object.keys(n).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return n[e]}})}),r(6)},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},s=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),p=r(0),u=r(3),c=function(e){function t(e){return n(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return o(t,e),s(t,[{key:"dateAndCategoryComponents",value:function(){var e=this.props.toolkit.ui,t=e.Metadata,r=e.Datetime,n=e.Section,i=this.props.metadata,o=i.age,a=i.categoryName,s=r({time:o}),p=n({text:a});this.bodyContainer.appendChild(t(s,p))}},{key:"componentDidMount",value:function(){this.dateAndCategoryComponents()}},{key:"render",value:function(){var e=this;return(0,p.h)("div",{className:"post-media"},(0,p.h)("div",{className:"feed-post-body",ref:function(t){return e.bodyContainer=t}},(0,p.h)(u.LinkWrapper,this.props),this.props.specialBehaviour&&"smart"===window.SETTINGS.BASTIAN.DEVICE_GROUP?(0,p.h)(u.MediaWrapper,this.props):(0,p.h)(u.LinkWrapper,a({},this.props,{renderMediaWrapper:!0}))))}}]),t}(p.Component);e.exports={MediaPost:c}},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){function t(e){e.preventDefault()}var r=this.props.renderMediaWrapper?"feed-media-wrapper":"feed-text-wrapper";Object.assign(this.props,{hasLinkWrapper:!0});var n=this.props.specialBehaviour&&"smart"===window.SETTINGS.BASTIAN.DEVICE_GROUP;return(0,p.h)("a",{href:this.props.url,className:r,onClick:n&&t},this.props.renderMediaWrapper?(0,p.h)(f,this.props):(0,p.h)(h,this.props))}var s=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),p=r(0),u=r(4),c=r(5),l=function(e){return e&&e.__esModule?e:{default:e}}(c),h=function(e){function t(e){return n(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return o(t,e),s(t,[{key:"buildToolkitComponents",value:function(){var e=this.props.toolkit.ui,t=e.Title,r=e.Summary,n=r({text:this.props.summary});this.headerContainer.appendChild(t({text:this.props.title})),n&&this.headerContainer.appendChild(n),this.headerContainer.addEventListener("click",this.clickHandler(this))}},{key:"componentDidMount",value:function(){this.buildToolkitComponents()}},{key:"componentWillUnmount",value:function(){window.removeEventListener("click",this.clickHandler(this),!1)}},{key:"clickHandler",value:function(e){return function(){var t=e.props.thumbnail?"com foto":"sem midia",r=l.default.findAncestor(e.headerContainer,".bastian-feed-item").dataset.index;r=l.default.pad(r,4),window._gaq.push(["_trackEvent","feed","post playlist","clique | feed | titulo | "+t+" | sem resumo | posicao "+r])}}},{key:"render",value:function(){var e=this;return(0,p.h)("div",{className:this.props.hasLinkWrapper?"":"feed-text-wrapper",ref:function(t){return e.headerContainer=t}})}}]),t}(p.Component),f=function(e){function t(e){n(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.onClick=r.clickHandler.bind(r),r}return o(t,e),s(t,[{key:"clickHandler",value:function(){var e=Array.isArray(this.props.thumbnail)&this.props.thumbnail.length>2,t=e?"mosaico":"foto",r=l.default.findAncestor(this.headerContainer,"bastian-feed-item").dataset.index;r=l.default.pad(r,4),window._gaq.push(["_trackEvent","feed","post playlist","clique | feed | midia | com "+t+" | sem resumo | posicao "+r])}},{key:"render",value:function(){var e=this,t="post-media-badge__icon";t+=" post-media-badge__icon--"+this.props.mediaType;var r="post-media-badge";return r+=this.props.mediaType?" post-media-badge--icon":"",(0,p.h)("div",{className:this.props.hasLinkWrapper?"":"feed-media-wrapper",onClick:this.onClick,ref:function(t){return e.pictureContainer=t}},(0,p.h)("div",{className:"bstn-fd-item-cover"},(0,p.h)("picture",{className:"bstn-fd-cover-picture"},(0,p.h)("div",{className:r},(0,p.h)("div",{className:t}),(0,p.h)("span",{className:"post-media-badge__info"},this.props.badgeLabel)),(0,p.h)(u.Thumbnail,{thumbnail:this.props.thumbnail}))))}}]),t}(p.Component);e.exports={MediaWrapper:f,LinkWrapper:a,TextWrapper:h}},function(e,t,r){"use strict";function n(e){var t=Array.isArray(this.props.thumbnail)&this.props.thumbnail.length>2;return(0,a.h)("div",{class:"post-media-cover"},t?(0,a.h)(i,{className:"thumbnail-image",thumbnail:this.props.thumbnail}):(0,a.h)(o,{className:"thumbnail-image",thumbnail:this.props.thumbnail}))}function i(e){var t=this;return(0,a.h)("div",{class:"post-media-mosaic"},(0,a.h)(o,{className:this.props.className+" "+this.props.className+"__0 post-media-mosaic__left",thumbnail:this.props.thumbnail[0]}),(0,a.h)("div",{class:"post-media-mosaic__right"},this.props.thumbnail.slice(1,3).map(function(e,r){var n=t.props.className+" "+t.props.className+"__"+(r+1);return(0,a.h)(o,{className:n,thumbnail:e})})))}function o(e){var t=Array.isArray(e.thumbnail)?e.thumbnail[0]:e.thumbnail;return(0,a.h)("div",{class:this.props.className,style:{backgroundImage:'url("'+t+'")'}})}var a=r(0);e.exports={Thumbnail:n,ThumbnailMosaic:i,ThumbnailImage:o}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={findAncestor:function(e,t){for(;!(e.matches||e.matchesSelector).call(e,t);)e=e.parentElement;return e},pad:function(e,t){return e+="",e.length>=t?e:new Array(t-e.length+1).join("0")+e}};t.default=n},function(e,t){}]);

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(e){function t(o){if(n[o])return n[o].exports;var a=n[o]={i:o,l:!1,exports:{}};return e[o].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t){e.exports=__webpack_require__(0)},function(e,t,n){"use strict";function o(e,t,n){(0,a.render)((0,a.h)(r.default,{bastianToolkit:n,data:e.externalData}),t)}Object.defineProperty(t,"__esModule",{value:!0}),t.name=void 0,t.render=o;var a=n(0);n(2);var i=n(3),r=function(e){return e&&e.__esModule?e:{default:e}}(i);t.name="post-ficha-de-carro"},function(e,t){},function(e,t,n){"use strict";function o(e){var t=e.data;return t?(0,a.h)(i.Post,{className:"post-ficha-de-carro"},(0,a.h)(i.Header,null,(0,a.h)("img",{src:t.foto})),(0,a.h)(i.Content,null,(0,a.h)(i.Section,null,(0,a.h)("h2",{className:"post-ficha-de-carro__title"},t.nome),(0,a.h)("a",{href:t.montadora.montadoraLink},t.montadora.montadoraLabel),l(t)))):null}Object.defineProperty(t,"__esModule",{value:!0}),t.default=o;var a=n(0),i=n(4),r=[{label:"Categoria",key:"categoria"},{label:"Motor",key:"motor"},{label:"Câmbio",key:"cambio"},{label:"Combustível",key:"combustivel"},{label:"Porta-malas/carga",key:"portaMala"},{label:"Último ano",key:"ultimoAno"}],l=function(e){return r.map(function(t){return e[t.key]?(0,a.h)("p",null,t.label,": ",e[t.key]):null})}},function(e,t,n){e.exports=function(e){function t(o){if(n[o])return n[o].exports;var a=n[o]={i:o,l:!1,exports:{}};return e[o].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=4)}([function(e,t){e.exports=n(0)},function(e,t,n){"use strict";function o(){var e=window.SETTINGS;return e&&e.BASTIAN&&e.BASTIAN.DEVICE_GROUP?e.BASTIAN.DEVICE_GROUP:"desktop"}function a(e,t){var n=[e];return t.className&&n.push(t.className),t.class&&n.push(t.class),n.join(" ")}function i(e){return(0,h.h)("div",{className:a(p.classPrefix,e)},e.children)}function r(e){return(0,h.h)("div",{className:a(p.classPrefix+"__header",e)},e.children)}function l(e){return(0,h.h)("h2",{className:a(p.classPrefix+"__title",e)},e.children)}function s(e){return(0,h.h)("div",{className:a(p.classPrefix+"__content",e)},e.children)}function u(e){return(0,h.h)("section",d({},e,{className:a(p.classPrefix+"__section",e)}),e.children)}function c(e){var t="left"==e.renderThumbnail?"right":"left",n=e.thumbnailFormat?e.thumbnailFormat:"squad",i={device_group:o(),"feed-type":"COMPONENTE","post-id":e.post&&e.post.id?e.post.id:"null","post-type":e.post&&e.post.type?e.post.type:"null"};return(0,h.h)(s,{className:"\n        "+a(p.classPrefix+"__content",e)+"\n        post-list--align-"+t+"\n      "},(0,h.h)("ul",null,e.item.map(function(t,o){return(0,h.h)(_.default,{horizonData:Object.assign({"post-url":t.url,"post-has-photo":t.thumbnail?"true":"false"},i,e.horizonData),key:o,position:o+1,renderThumbnail:e.renderThumbnail,bastianToolkit:e.bastianToolkit,thumbnailFormat:n,svg:e.svg,item:t,gaLabel:e.gaLabel,gaAction:e.gaAction})})))}function f(e){return(0,h.h)("footer",{className:a(p.classPrefix+"__footer theme",e)},e.children)}Object.defineProperty(t,"__esModule",{value:!0});var d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};t.Post=i,t.Header=r,t.Title=l,t.Content=s,t.Section=u,t.ListPost=c,t.Footer=f;var h=n(0),p=n(5),m=n(2),_=function(e){return e&&e.__esModule?e:{default:e}}(m);f.Link=function(e){return(0,h.h)("a",{className:a(p.classPrefix+"__footer-link",e),href:e.href},e.children,(0,h.h)("span",{className:p.classPrefix+"__arrow"},(0,h.h)("svg",{viewBox:"2 2 18 18"},(0,h.h)("path",{d:"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"}))))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),a=n(1),i=n(3),r=function(e){var t=e.thumbnailFormat,n=e.item,a=e.svg;return n.thumbnail?(0,o.h)("div",{className:"post-list__column-right"},(0,o.h)("div",{className:"post-list__column-right__image-"+t},l(a),(0,o.h)("img",{src:n.thumbnail,alt:n.title}))):null},l=function(e){return e?(0,o.h)("svg",{className:"post-list__column-right__image-squad__icon_player",width:"30px",height:"27px",viewBox:"0 0 30 27",version:"1.1"},(0,o.h)("g",{id:"Post-Playlist",stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},(0,o.h)("g",{id:"BBB-AUTOMATICO-Copy",transform:"translate(-258.000000, -604.000000)",fill:"#FFFFFF"},(0,o.h)("g",{id:"Group-2",transform:"translate(16.000000, 315.000000)"},(0,o.h)("g",{id:"Group-8-Copy"},(0,o.h)("g",{id:"Group",transform:"translate(234.000000, 230.000000)"},(0,o.h)("g",{id:"SINALIZACAO"},(0,o.h)("g",{id:"icon",transform:"translate(8.000000, 58.000000)"},(0,o.h)("polygon",{id:"Fill-3",points:"0.934261363 12.3903949 23.4727793 12.3903949 23.4727793 8.63514534 0.934261363 8.63514534"}),(0,o.h)("polygon",{id:"Fill-6",points:"0.934261363 4.87876905 23.4727793 4.87876905 23.4727793 1.12351946 0.934261363 1.12351946"}),(0,o.h)("polygon",{id:"Fill-9",points:"0.934261363 19.9014575 15.9595644 19.9014575 15.9595644 16.1462079 0.934261363 16.1462079"}),(0,o.h)("polygon",{id:"Fill-12",points:"19.7165663 27.413027 29.1078033 21.7795893 19.7165663 16.1461515"}))))))))):null},s=function(e){var t=e.headline;return t?(0,o.h)("div",{className:"post-list__column-left__headline"},(0,o.h)("p",null,t)):null},u=function(e){var t=e.item;return t.title?(0,o.h)("div",{className:"post-list__column-left__title theme"},(0,o.h)("p",null,t.title)):null},c=function(e){var t=e.description;return t?(0,o.h)("div",{className:"post-list__column-left__description"},(0,o.h)("span",null,t)):null},f=function(e){var t=function(e){return(0,o.h)("a",e," ",e.children)},n=(0,i.withTracking)(t,"onClick",!1),l="clique | post 1 | "+e.gaLabel+" | posicao ",f=e.bastianToolkit?"clique | "+e.bastianToolkit.getAreaId()+" | post "+e.position+" | "+e.gaLabel+" | posicao "+e.bastianToolkit.getItemPosition()+" ":l,d=e.bastianToolkit?Object.assign({"post-position":e.bastianToolkit.getItemPosition()+""},e.horizonData):e.horizonData,h=e.item.className||"";return(0,o.h)(a.Section,{className:"post-list__section "+h},(0,o.h)(n,{horizonData:d,href:e.item.url,gaCategory:"feed",gaAction:e.gaAction,gaLabel:f},(0,o.h)("li",{className:"post-list__item"},(0,o.h)("div",{className:"post-list__column-left"},s(e.item),u(e),c(e.item)),r(e))))};t.default=f},function(e,t,n){"use strict";function o(){d||(d=!0,window.requestIdleCallback(a,{timeout:2e3}))}function a(e){for(d=!1,void 0===e&&(e={timeRemaining:function(){return Number.MAX_VALUE}});e.timeRemaining()>0&&f.length>0;)i(f.pop());f.length>0&&o()}function i(e){window.ga(u+"_portal.send","event",e.gaEv_category,e.gaEv_action,e.gaEv_label)}function r(e,t){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return function(o){var a=function(e){var a=o.horizonData;o[t]&&o[t](e),h(o.gaCategory,o.gaAction,o.gaLabel,n),p(a)},i=Object.assign({},o);return i[t]=a,(0,l.h)(e,i,o.children)}}Object.defineProperty(t,"__esModule",{value:!0}),t.sendToHorizon=t.sendToGa=void 0,t.withTracking=r;var l=n(0),s=window.cdaaas.SETTINGS,u=s.SITE_ID,c=s.CANONICAL_URL;window.requestIdleCallback=window.requestIdleCallback||function(e){var t=Date.now();return setTimeout(function(){e({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-t))}})},1)},window.cancelIdleCallback=window.cancelIdleCallback||function(e){clearTimeout(e)};var f=[],d=!1,h=t.sendToGa=function(e,t,n){var a=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],r={gaEv_category:e,gaEv_action:t,gaEv_label:n};a?(f.push(r),o()):i(r)},p=t.sendToHorizon=function(e){window.Horizon.Client().sendPostClick({attributes:e,object:c,product:u})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(1);Object.keys(o).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return o[e]}})});var a=n(3);Object.keys(a).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return a[e]}})});var i=n(2);Object.keys(i).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}})}),n(6)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.classPrefix="post-bastian-products"},function(e,t){}])}]);

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(t){function e(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=2)}([function(t,e){t.exports=__webpack_require__(0)},function(t,e){},function(t,e,n){"use strict";function o(t,e,n){(0,i.render)((0,i.h)(r.default,{data:t,bastianToolkit:n}),e)}Object.defineProperty(e,"__esModule",{value:!0}),e.name=void 0,e.render=o;var i=n(0);n(1);var a=n(3),r=function(t){return t&&t.__esModule?t:{default:t}}(a);e.name="post-card-headline"},function(t,e,n){"use strict";function o(t){var e=t.data,n=t.bastianToolkit;if(!e.externalData)return n.implode(),null;var o=e.externalData,r=o.title,l=o.subtitle,s=o.photo;return r||l||s?(0,i.h)(a.Post,{className:"post-card-headline theme"},s&&(0,i.h)("img",{className:"post-card-headline__image",src:s,alt:r}),(0,i.h)(a.Content,null,(0,i.h)(a.Section,null,r&&(0,i.h)("h2",{className:"post-card-headline__title"},r),l&&(0,i.h)("p",{className:"post-card-headline__subtitle"},l)))):(n.implode(),null)}Object.defineProperty(e,"__esModule",{value:!0});var i=n(0),a=n(4);n(5),n(1),e.default=o},function(t,e,n){t.exports=function(t){function e(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=4)}([function(t,e){t.exports=n(0)},function(t,e,n){"use strict";function o(t,e){var n=[t];return e.className&&n.push(e.className),e.class&&n.push(e.class),n.join(" ")}function i(t){return(0,f.h)("div",{className:o(h.classPrefix,t)},t.children)}function a(t){return(0,f.h)("div",{className:o(h.classPrefix+"__header",t)},t.children)}function r(t){return(0,f.h)("h2",{className:o(h.classPrefix+"__title",t)},t.children)}function l(t){return(0,f.h)("div",{className:o(h.classPrefix+"__content",t)},t.children)}function s(t){return(0,f.h)("section",d({},t,{className:o(h.classPrefix+"__section",t)}),t.children)}function u(t){var e="left"==t.renderThumbnail?"right":"left",n=t.thumbnailFormat?t.thumbnailFormat:"squad",i={device_group:_,"feed-type":"COMPONENTE","post-id":t.post&&t.post.id?t.post.id:"null","post-type":t.post&&t.post.type?t.post.type:"null"};return(0,f.h)(l,{className:"\n        "+o(h.classPrefix+"__content",t)+"\n        post-list--align-"+e+"\n      "},(0,f.h)("ul",null,t.item.map(function(e,o){return(0,f.h)(m.default,{horizonData:Object.assign({"post-url":e.url,"post-has-photo":e.thumbnail?"true":"false"},i,t.horizonData),key:o,position:o+1,renderThumbnail:t.renderThumbnail,bastianToolkit:t.bastianToolkit,thumbnailFormat:n,svg:t.svg,item:e,gaLabel:t.gaLabel,gaAction:t.gaAction})})))}function c(t){return(0,f.h)("footer",{className:o(h.classPrefix+"__footer theme",t)},t.children)}Object.defineProperty(e,"__esModule",{value:!0});var d=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t};e.Post=i,e.Header=a,e.Title=r,e.Content=l,e.Section=s,e.ListPost=u,e.Footer=c;var f=n(0),h=n(5),p=n(2),m=function(t){return t&&t.__esModule?t:{default:t}}(p),_=window.SETTINGS.BASTIAN.DEVICE_GROUP;c.Link=function(t){return(0,f.h)("a",{className:o(h.classPrefix+"__footer-link",t),href:t.href},t.children,(0,f.h)("span",{className:h.classPrefix+"__arrow"},(0,f.h)("svg",{viewBox:"2 2 18 18"},(0,f.h)("path",{d:"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"}))))}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),i=n(1),a=n(3),r=function(t){var e=t.thumbnailFormat,n=t.item,i=t.svg;return n.thumbnail?(0,o.h)("div",{className:"post-list__column-right"},(0,o.h)("div",{className:"post-list__column-right__image-"+e},l(i),(0,o.h)("img",{src:n.thumbnail,alt:n.title}))):null},l=function(t){return t?(0,o.h)("svg",{className:"post-list__column-right__image-squad__icon_player",width:"30px",height:"27px",viewBox:"0 0 30 27",version:"1.1"},(0,o.h)("g",{id:"Post-Playlist",stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},(0,o.h)("g",{id:"BBB-AUTOMATICO-Copy",transform:"translate(-258.000000, -604.000000)",fill:"#FFFFFF"},(0,o.h)("g",{id:"Group-2",transform:"translate(16.000000, 315.000000)"},(0,o.h)("g",{id:"Group-8-Copy"},(0,o.h)("g",{id:"Group",transform:"translate(234.000000, 230.000000)"},(0,o.h)("g",{id:"SINALIZACAO"},(0,o.h)("g",{id:"icon",transform:"translate(8.000000, 58.000000)"},(0,o.h)("polygon",{id:"Fill-3",points:"0.934261363 12.3903949 23.4727793 12.3903949 23.4727793 8.63514534 0.934261363 8.63514534"}),(0,o.h)("polygon",{id:"Fill-6",points:"0.934261363 4.87876905 23.4727793 4.87876905 23.4727793 1.12351946 0.934261363 1.12351946"}),(0,o.h)("polygon",{id:"Fill-9",points:"0.934261363 19.9014575 15.9595644 19.9014575 15.9595644 16.1462079 0.934261363 16.1462079"}),(0,o.h)("polygon",{id:"Fill-12",points:"19.7165663 27.413027 29.1078033 21.7795893 19.7165663 16.1461515"}))))))))):null},s=function(t){var e=t.headline;return e?(0,o.h)("div",{className:"post-list__column-left__headline"},(0,o.h)("p",null,e)):null},u=function(t){var e=t.item;return e.title?(0,o.h)("div",{className:"post-list__column-left__title theme"},(0,o.h)("p",null,e.title)):null},c=function(t){var e=t.description;return e?(0,o.h)("div",{className:"post-list__column-left__description"},(0,o.h)("span",null,e)):null},d=function(t){var e=function(t){return(0,o.h)("a",t," ",t.children)},n=(0,a.withTracking)(e,"onClick",!1),l="clique | post 1 | "+t.gaLabel+" | posicao ",d=t.bastianToolkit?"clique | "+t.bastianToolkit.getAreaId()+" | post "+t.position+" | "+t.gaLabel+" | posicao "+t.bastianToolkit.getItemPosition()+" ":l,f=t.bastianToolkit?Object.assign({"post-position":t.bastianToolkit.getItemPosition()+""},t.horizonData):t.horizonData,h=t.item.className||"";return(0,o.h)(i.Section,{className:"post-list__section "+h},(0,o.h)(n,{horizonData:f,href:t.item.url,gaCategory:"feed",gaAction:t.gaAction,gaLabel:d},(0,o.h)("li",{className:"post-list__item"},(0,o.h)("div",{className:"post-list__column-left"},s(t.item),u(t),c(t.item)),r(t))))};e.default=d},function(t,e,n){"use strict";function o(){f||(f=!0,window.requestIdleCallback(i,{timeout:2e3}))}function i(t){for(f=!1,void 0===t&&(t={timeRemaining:function(){return Number.MAX_VALUE}});t.timeRemaining()>0&&d.length>0;)a(d.pop());d.length>0&&o()}function a(t){window.ga(u+"_portal.send","event",t.gaEv_category,t.gaEv_action,t.gaEv_label)}function r(t,e){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return function(o){var i=function(t){var i=o.horizonData;o[e]&&o[e](t),h(o.gaCategory,o.gaAction,o.gaLabel,n),p(i)},a=Object.assign({},o);return a[e]=i,(0,l.h)(t,a,o.children)}}Object.defineProperty(e,"__esModule",{value:!0}),e.sendToHorizon=e.sendToGa=void 0,e.withTracking=r;var l=n(0),s=window.cdaaas.SETTINGS,u=s.SITE_ID,c=s.CANONICAL_URL;window.requestIdleCallback=window.requestIdleCallback||function(t){var e=Date.now();return setTimeout(function(){t({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-e))}})},1)},window.cancelIdleCallback=window.cancelIdleCallback||function(t){clearTimeout(t)};var d=[],f=!1,h=e.sendToGa=function(t,e,n){var i=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],r={gaEv_category:t,gaEv_action:e,gaEv_label:n};i?(d.push(r),o()):a(r)},p=e.sendToHorizon=function(t){window.Horizon.Client().sendPostClick({attributes:t,object:c,product:u})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(1);Object.keys(o).forEach(function(t){"default"!==t&&"__esModule"!==t&&Object.defineProperty(e,t,{enumerable:!0,get:function(){return o[t]}})});var i=n(3);Object.keys(i).forEach(function(t){"default"!==t&&"__esModule"!==t&&Object.defineProperty(e,t,{enumerable:!0,get:function(){return i[t]}})});var a=n(2);Object.keys(a).forEach(function(t){"default"!==t&&"__esModule"!==t&&Object.defineProperty(e,t,{enumerable:!0,get:function(){return a[t]}})}),n(6)},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.classPrefix="post-bastian-products"},function(t,e){}])},function(t,e){}]);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t){e.exports=__webpack_require__(0)},function(e,t,n){"use strict";function o(e,t){(0,i.render)((0,i.h)(r.default,{data:e}),t)}Object.defineProperty(t,"__esModule",{value:!0}),t.name=void 0,t.render=o;var i=n(0);n(2);var a=n(3),r=function(e){return e&&e.__esModule?e:{default:e}}(a);t.name="post-ficha-politico"},function(e,t){},function(e,t,n){"use strict";function o(e){if(0==Boolean(e.data.externalData)||0==Object.keys(e.data.externalData).length)return console.log("[post-ficha-politico] externalDataIsEmpty"),null;var t=e.data.externalData,n=l(t);return(0,i.h)("div",{className:"post-ficha-politico"},(0,i.h)(a.Header,{className:"post-ficha-politico__header"},(0,i.h)("img",{class:"post-ficha-politico-rounded-photo post-ficha-politico-rounded-photo--large",src:t.foto,alt:t.nome})),(0,i.h)(a.Content,{className:"post-ficha-politico__content"},(0,i.h)("section",{className:"post-ficha-politico__section"},(0,i.h)("h2",{className:"post-ficha-politico__title"},t.nome),t.descricao?(0,i.h)("h3",{className:"post-ficha-politico__subtitle"},t.descricao):null,t.descricao&&n.length>0?(0,i.h)("p",{className:"post-ficha-politico__line"}):null,n)))}Object.defineProperty(t,"__esModule",{value:!0});var i=n(0),a=n(4),r=[{label:"Nascimento",key:"dataDeNascimento"},{label:"Falecimento",key:"dataDeFalecimento"},{label:"Escolaridade",key:"escolaridade"},{label:"Naturalidade",key:"naturalidade"}],l=function(e){return r.map(function(t){return e[t.key]?(0,i.h)("p",null,t.label,": ",e[t.key]):null}).filter(function(e){return null!=e})};t.default=o},function(e,t,n){e.exports=function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=4)}([function(e,t){e.exports=n(0)},function(e,t,n){"use strict";function o(){var e=window.SETTINGS;return e&&e.BASTIAN&&e.BASTIAN.DEVICE_GROUP?e.BASTIAN.DEVICE_GROUP:"desktop"}function i(e,t){var n=[e];return t.className&&n.push(t.className),t.class&&n.push(t.class),n.join(" ")}function a(e){return(0,p.h)("div",{className:i(h.classPrefix,e)},e.children)}function r(e){return(0,p.h)("div",{className:i(h.classPrefix+"__header",e)},e.children)}function l(e){return(0,p.h)("h2",{className:i(h.classPrefix+"__title",e)},e.children)}function s(e){return(0,p.h)("div",{className:i(h.classPrefix+"__content",e)},e.children)}function c(e){return(0,p.h)("section",f({},e,{className:i(h.classPrefix+"__section",e)}),e.children)}function u(e){var t="left"==e.renderThumbnail?"right":"left",n=e.thumbnailFormat?e.thumbnailFormat:"squad",a={device_group:o(),"feed-type":"COMPONENTE","post-id":e.post&&e.post.id?e.post.id:"null","post-type":e.post&&e.post.type?e.post.type:"null"};return(0,p.h)(s,{className:"\n        "+i(h.classPrefix+"__content",e)+"\n        post-list--align-"+t+"\n      "},(0,p.h)("ul",null,e.item.map(function(t,o){return(0,p.h)(_.default,{horizonData:Object.assign({"post-url":t.url,"post-has-photo":t.thumbnail?"true":"false"},a,e.horizonData),key:o,position:o+1,renderThumbnail:e.renderThumbnail,bastianToolkit:e.bastianToolkit,thumbnailFormat:n,svg:e.svg,item:t,gaLabel:e.gaLabel,gaAction:e.gaAction})})))}function d(e){return(0,p.h)("footer",{className:i(h.classPrefix+"__footer theme",e)},e.children)}Object.defineProperty(t,"__esModule",{value:!0});var f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};t.Post=a,t.Header=r,t.Title=l,t.Content=s,t.Section=c,t.ListPost=u,t.Footer=d;var p=n(0),h=n(5),m=n(2),_=function(e){return e&&e.__esModule?e:{default:e}}(m);d.Link=function(e){return(0,p.h)("a",{className:i(h.classPrefix+"__footer-link",e),href:e.href},e.children,(0,p.h)("span",{className:h.classPrefix+"__arrow"},(0,p.h)("svg",{viewBox:"2 2 18 18"},(0,p.h)("path",{d:"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"}))))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=n(1),a=n(3),r=function(e){var t=e.thumbnailFormat,n=e.item,i=e.svg;return n.thumbnail?(0,o.h)("div",{className:"post-list__column-right"},(0,o.h)("div",{className:"post-list__column-right__image-"+t},l(i),(0,o.h)("img",{src:n.thumbnail,alt:n.title}))):null},l=function(e){return e?(0,o.h)("svg",{className:"post-list__column-right__image-squad__icon_player",width:"30px",height:"27px",viewBox:"0 0 30 27",version:"1.1"},(0,o.h)("g",{id:"Post-Playlist",stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},(0,o.h)("g",{id:"BBB-AUTOMATICO-Copy",transform:"translate(-258.000000, -604.000000)",fill:"#FFFFFF"},(0,o.h)("g",{id:"Group-2",transform:"translate(16.000000, 315.000000)"},(0,o.h)("g",{id:"Group-8-Copy"},(0,o.h)("g",{id:"Group",transform:"translate(234.000000, 230.000000)"},(0,o.h)("g",{id:"SINALIZACAO"},(0,o.h)("g",{id:"icon",transform:"translate(8.000000, 58.000000)"},(0,o.h)("polygon",{id:"Fill-3",points:"0.934261363 12.3903949 23.4727793 12.3903949 23.4727793 8.63514534 0.934261363 8.63514534"}),(0,o.h)("polygon",{id:"Fill-6",points:"0.934261363 4.87876905 23.4727793 4.87876905 23.4727793 1.12351946 0.934261363 1.12351946"}),(0,o.h)("polygon",{id:"Fill-9",points:"0.934261363 19.9014575 15.9595644 19.9014575 15.9595644 16.1462079 0.934261363 16.1462079"}),(0,o.h)("polygon",{id:"Fill-12",points:"19.7165663 27.413027 29.1078033 21.7795893 19.7165663 16.1461515"}))))))))):null},s=function(e){var t=e.headline;return t?(0,o.h)("div",{className:"post-list__column-left__headline"},(0,o.h)("p",null,t)):null},c=function(e){var t=e.item;return t.title?(0,o.h)("div",{className:"post-list__column-left__title theme"},(0,o.h)("p",null,t.title)):null},u=function(e){var t=e.description;return t?(0,o.h)("div",{className:"post-list__column-left__description"},(0,o.h)("span",null,t)):null},d=function(e){var t=function(e){return(0,o.h)("a",e," ",e.children)},n=(0,a.withTracking)(t,"onClick",!1),l="clique | post 1 | "+e.gaLabel+" | posicao ",d=e.bastianToolkit?"clique | "+e.bastianToolkit.getAreaId()+" | post "+e.position+" | "+e.gaLabel+" | posicao "+e.bastianToolkit.getItemPosition()+" ":l,f=e.bastianToolkit?Object.assign({"post-position":e.bastianToolkit.getItemPosition()+""},e.horizonData):e.horizonData,p=e.item.className||"";return(0,o.h)(i.Section,{className:"post-list__section "+p},(0,o.h)(n,{horizonData:f,href:e.item.url,gaCategory:"feed",gaAction:e.gaAction,gaLabel:d},(0,o.h)("li",{className:"post-list__item"},(0,o.h)("div",{className:"post-list__column-left"},s(e.item),c(e),u(e.item)),r(e))))};t.default=d},function(e,t,n){"use strict";function o(){f||(f=!0,window.requestIdleCallback(i,{timeout:2e3}))}function i(e){for(f=!1,void 0===e&&(e={timeRemaining:function(){return Number.MAX_VALUE}});e.timeRemaining()>0&&d.length>0;)a(d.pop());d.length>0&&o()}function a(e){window.ga(c+"_portal.send","event",e.gaEv_category,e.gaEv_action,e.gaEv_label)}function r(e,t){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return function(o){var i=function(e){var i=o.horizonData;o[t]&&o[t](e),p(o.gaCategory,o.gaAction,o.gaLabel,n),h(i)},a=Object.assign({},o);return a[t]=i,(0,l.h)(e,a,o.children)}}Object.defineProperty(t,"__esModule",{value:!0}),t.sendToHorizon=t.sendToGa=void 0,t.withTracking=r;var l=n(0),s=window.cdaaas.SETTINGS,c=s.SITE_ID,u=s.CANONICAL_URL;window.requestIdleCallback=window.requestIdleCallback||function(e){var t=Date.now();return setTimeout(function(){e({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-t))}})},1)},window.cancelIdleCallback=window.cancelIdleCallback||function(e){clearTimeout(e)};var d=[],f=!1,p=t.sendToGa=function(e,t,n){var i=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],r={gaEv_category:e,gaEv_action:t,gaEv_label:n};i?(d.push(r),o()):a(r)},h=t.sendToHorizon=function(e){window.Horizon.Client().sendPostClick({attributes:e,object:u,product:c})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(1);Object.keys(o).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return o[e]}})});var i=n(3);Object.keys(i).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}})});var a=n(2);Object.keys(a).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return a[e]}})}),n(6)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.classPrefix="post-bastian-products"},function(e,t){}])}]);

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports=function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=7)}([function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(){function e(){r(this,e),this.options={}}return i(e,[{key:"getParams",value:function(e){var t={skipImpressions:this.isSkippedImpression()};return Object.assign({},t,e)}},{key:"getLocationParams",value:function(){return{drawed:!0,countImpressions:!this.isSkippedImpression()}}},{key:"getHeaders",value:function(){return this.options.extraHeaders||[]}},{key:"getDict",value:function(){return this.options}},{key:"getTimeout",value:function(){var e=this.options.timeout;return void 0===e&&(e=1e3),e}},{key:"skipImpression",value:function(){return this.options.skipImpressions=!0,this}},{key:"timeout",value:function(e){return this.options.timeout=e,this}},{key:"isFieldSetted",value:function(e){return void 0!==e&&!1!==e}},{key:"isSkippedImpression",value:function(){return this.isFieldSetted(this.options.skipImpressions)}},{key:"addHeader",value:function(e){var t=[];return this.options.hasOwnProperty("extraHeaders")&&(t=this.options.extraHeaders),t.push(e),this.options.extraHeaders=t,this}},{key:"enableGADebugger",value:function(){return this.options.enableGADebugger=!0,this}},{key:"isEnabledGADebugger",value:function(){return this.isFieldSetted(this.options.enableGADebugger)}}],[{key:"validated",value:function(t){if(t instanceof e)return t;if(void 0===t)return new e;throw new TypeError("GloboABOptions não válido")}}]),e}();e.exports=o},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(10),a=function(){function e(t){r(this,e),this.abHost=t}return i(e,[{key:"oneWaySend",value:function(e,t,n,r){this.do("PUT",e,null,t,null,null,n,r)}},{key:"do",value:function(e,t,n,r,i,a){var s=this,u=arguments.length>6&&void 0!==arguments[6]?arguments[6]:{},l=arguments.length>7&&void 0!==arguments[7]?arguments[7]:1e3,c="",d=o.interceptParams(t,n);for(var f in d)d.hasOwnProperty(f)&&(c+="&"+f+"="+d[f]);c&&(c="?"+c.substring(1));var v=this.abHost+t+c,p=this.createXHR();p.open(e,v,!0),p.timeout=l,p.onload=function(){p.status>=200&&p.status<400?s.callIfDefined(i,p):s.callIfDefined(a,s.handleError(p,v))},p.onerror=function(e){s.callIfDefined(a,s.handleError(e,v))},p.ontimeout=function(e){s.callIfDefined(a,s.handleError(e,v))},r&&(p.setRequestHeader("Content-Type","application/json;charset=utf-8"),r=JSON.stringify(r)),Object.keys(u).forEach(function(e){p.setRequestHeader(e,u[e])}),p.send(r)}},{key:"handleError",value:function(e,t){var n={};return n.type=e.type?e.type:"undefined",e.target instanceof XMLHttpRequest&&(e=e.target),e instanceof XMLHttpRequest?(n.status=e.status,n.url=t,n.timeout=e.timeout,n.msg=e.responseText):n.msg=e.toString(),n}},{key:"createXHR",value:function(){var e=new XMLHttpRequest;return e.withCredentials=!0,e}},{key:"callIfDefined",value:function(e,t){e&&e(t)}}]),e}();e.exports=a},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(1),a=n(4),s=n(11),u=function(){function e(t,n){r(this,e),this.abHost=t,this.request=new o(this.abHost),this.requestWrapper=new s(this.abHost),n&&(this.horizonWrapper=new a(n))}return i(e,[{key:"selectedAlternatives",value:function(e,t,n,r){this.request.do("GET","/v2/selected-alternatives",t.getParams({experiments:e}),null,n,r,t.getHeaders(),t.getTimeout())}},{key:"recordMetric",value:function(e,t,n){var r="/v2/tests/"+t.testId+"/"+e,i={experiment:t.experiment,alternative:t.alternative};this.requestWrapper.oneWay(r,i,n.getHeaders(),n.getTimeout()),this.recordHorizon(e,t)}},{key:"recordHorizonMulti",value:function(e,t){for(var n in t)t.hasOwnProperty(n)&&this.recordHorizon(e,t[n])}},{key:"recordHorizon",value:function(e,t){this.horizonWrapper&&this.horizonWrapper.send("ab",{metricId:e,experiment:t.experiment,alternative:t.alternative,trackId:t.testId})}}]),e}();e.exports=u},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(){function e(t){r(this,e),this.horizonClient=t}return i(e,[{key:"send",value:function(e,t){var n=null;"ab"===e?(n=this.getABSignal(t),this.horizonClient.send(n)):"mab"===e&&(n=this.getMABSignal(t),this.horizonClient.send(n))}},{key:"getABSignal",value:function(e){return{id:"ab-"+e.metricId,contentType:"ab",version:"1.0",properties:{experiment:e.experiment,alternative:e.alternative,trackId:e.trackId}}}},{key:"getMABSignal",value:function(e){return{id:"mab-"+e.metricId,contentType:"mab",version:"1.0",properties:{algorithm:e.algorithm,experiment:e.experiment,arm:e.arm,trackId:e.testId}}}}]),e}();e.exports=o},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(0),a=function(){function e(t,n){var i=t.experiment,o=t.alternative,a=t.testId;r(this,e),this.experiment=i,this.alternative=o,this.testId=a,this.context=n}return i(e,[{key:"impression",value:function(e){e=o.validated(e),this.context.googleAnalytics.impression(e,this.experiment),this._sendMetric("impression",e)}},{key:"conversion",value:function(e){e=o.validated(e),this.context.googleAnalytics.conversion(e,this.experiment),this._sendMetric("conversion",e)}},{key:"_sendMetric",value:function(e,t){var n={experiment:this.experiment,alternative:this.alternative,testId:this.testId};this.context.abEndpoint.recordMetric(e,n,t)}}],[{key:"parseRequest",value:function(t,n){var r=JSON.parse(t),i={};for(var o in r.experiments)if(r.experiments.hasOwnProperty(o)){var a=r.experiments[o],s=new e(a,n);i[o]=s}return i}}]),e}();e.exports=a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=function(){function e(){r(this,e),this.created=!1}return o(e,[{key:"googleAnalytics",value:function(e,t,n,r){"function"==typeof ga?(this.created||(ga("create","UA-6912161-21","auto","globoab"),this.created=!0),ga("globoab.send","event","debug-ab",e,this.toMessage(t,n,r))):console.error("Globo-ab - It was not possible to identify the ga function...")}},{key:"choose",value:function(e,t,n,r){this._send(e,t,"choose",n,r)}},{key:"impression",value:function(e,t){this._send(e,t,"impression","call")}},{key:"conversion",value:function(e,t){this._send(e,t,"conversion","call")}},{key:"_send",value:function(e,t,n,r,i){void 0!==e&&e.isEnabledGADebugger()&&this.googleAnalytics(t,n,r,i)}},{key:"toMessage",value:function(e,t,n){"object"===(void 0===n?"undefined":i(n))&&(n=JSON.stringify(n).substring(0,1e3));var r=e+"."+t;return void 0!==n&&(r=r+"."+n),r}}]),e}();e.exports=a},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t,n){var r=/(localhost|\.qa\.)/.test(window.location.host)?"qa":"prod";if(n.isLargeScreen)return n.implode(),null;console.log("[ENV]",r),"qa"==r&&l.Settings.useQAConfiguration(),console.log("[HORIZON SETTINGS]",l);var i=e.tenantId,o=window.cdaaas.SETTINGS.MOBILE_GROUP,s=new l.HorizonClient(i,o);if(!window.postStoriesExperiment){var c=new a.default(r,s);window.postStoriesExperiment=c.choose(window.cdaaas.SETTINGS.SITE_ID+"-post-stories",c.createOptions())}window.postStoriesExperiment.then(function(r){if("control"===r.alternative)return n.implode(),null;(0,u.default)(e,t,r,s)}).catch(function(n){404===n.status&&(0,u.default)(e,t)})}Object.defineProperty(t,"__esModule",{value:!0}),t.name=void 0,t.render=i;var o=n(8),a=r(o);n(19),n(20);var s=n(21),u=r(s),l=n(24);t.name="post-stories"},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(0),a=n(9),s=n(13),u=n(16),l=function(){function e(t,n){r(this,e),this.env=this._getEnv(t),this.server=this._getServer(this.env),this.horizonClient=n,this.abMain=new a(this.server,this.horizonClient)}return i(e,[{key:"createOptions",value:function(){return new o}},{key:"mab",value:function(){return new s(this.server,this.horizonClient)}},{key:"location",value:function(){return new u(this.server,this.horizonClient)}},{key:"impression",value:function(e,t){var n=e.experiment,r=e.alternative,i=e.testId;this.abMain.impression({experiment:n,alternative:r,testId:i},t)}},{key:"conversion",value:function(e,t){var n=e.experiment,r=e.alternative,i=e.testId;this.abMain.conversion({experiment:n,alternative:r,testId:i},t)}},{key:"choose",value:function(e,t){return this.abMain.choose(e,t)}},{key:"_getEnv",value:function(e){return"prod"===e?e:"qa"}},{key:"_getServer",value:function(e){return"prod"===this.env?"https://globo-ab.globo.com":"https://globo-ab.qa.globoi.com"}}]),e}();e.exports=l},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(0),a=n(3),s=n(5),u=n(6),l=function(){function e(t,n){r(this,e),this.server=t,this.horizonClient=n,this.abEndpoint=new a(this.server,this.horizonClient),this.googleAnalytics=new u}return i(e,[{key:"impression",value:function(e,t){var n=e.experiment,r=e.alternative,i=e.testId;new s({experiment:n,alternative:r,testId:i},this).impression(t)}},{key:"conversion",value:function(e,t){var n=e.experiment,r=e.alternative,i=e.testId;new s({experiment:n,alternative:r,testId:i},this).conversion(t)}},{key:"choose",value:function(e,t){var n=o.validated(t);if(this.googleAnalytics.choose(n,e,"call"),"string"==typeof e)return this._chooseOne(e,n);if(Array.isArray(e))return this._chooseMulti(e,n);throw new TypeError("Para sorteio o experimento precisa ser uma string ou uma lista")}},{key:"_chooseOne",value:function(e,t){var n=this;return new Promise(function(r,i){n.abEndpoint.selectedAlternatives(e,t,function(i){var o=s.parseRequest(i.responseText,n),a=o[e];t.isSkippedImpression()||n.abEndpoint.recordHorizon("impression",a),n.googleAnalytics.choose(t,e,"success"),r(a)},function(r){n.googleAnalytics.choose(t,e,"fail",r),i(r)})})}},{key:"_chooseMulti",value:function(e,t){var n=this,r=e.join(",");return new Promise(function(e,i){n.abEndpoint.selectedAlternatives(r,t,function(i){var o=s.parseRequest(i.responseText,n);t.isSkippedImpression()||n.abEndpoint.recordHorizonMulti("impression",o),n.googleAnalytics.choose(t,r,"success"),e(o)},function(e){n.googleAnalytics.choose(t,r,"fail",e),i(e)})})}}]),e}();e.exports=l},function(e,t,n){"use strict";(function(t){function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=function(){function e(){n(this,e)}return r(e,null,[{key:"getPluginParams",value:function(){var t={},n=["ab-client-context","ab-client-experiment","ab-client-alternative"],r=e.getDocumentLocationSearch().substr(1).split("&");for(var i in r)if(r.hasOwnProperty(i)){var o=r[i].split("=");n.indexOf(o[0])>-1&&(t[o[0]]=o[1])}return t}},{key:"getDocumentLocationSearch",value:function(){return document.location.search}},{key:"isCompatibleWithPlugin",value:function(){return void 0!==t.window&&!!t.window.chrome&&!!t.window.chrome.webstore}},{key:"interceptParams",value:function(t,n){try{if(e.isCompatibleWithPlugin()&&t){var r=void 0,i=void 0;if(t.indexOf("/location/")>-1){var o=t.split("/");r=o[o.length-1]}else t.indexOf("selected-alternatives")>-1&&(i=n.experiments||n.experiment);if(i||r)return Object.assign({},n,this.getExperimentSettings(r,i))}}catch(e){console.error(e)}return n}},{key:"getExperimentSettings",value:function(e,t){var n=this.getPluginParams();if(e&&n["ab-client-context"]===e&&n["ab-client-experiment"]){var r={experiment:n["ab-client-experiment"],alternative:n["ab-client-alternative"]};return r.alternative||delete r.alternative,r}return t&&n["ab-client-experiment"]===t&&n["ab-client-alternative"]?{alternative:n["ab-client-alternative"]}:{}}}]),e}();e.exports=i}).call(t,n(2))},function(e,t,n){"use strict";(function(t){function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(12),a=n(1),s=function(){function e(t){r(this,e),this.host=t,this.sendBeaconOneWay=new o(this.host),this.xmlHttp=new a(this.host)}return i(e,[{key:"oneWay",value:function(e,t,n,r){this.isBrowserSupportSendBeacon()&&!this.hasHeaders(n)?this.sendBeaconOneWay.send(e,t):this.xmlHttp.oneWaySend(e,t,n,r)}},{key:"isBrowserSupportSendBeacon",value:function(){return!(void 0===t.navigator||!t.navigator.sendBeacon)}},{key:"hasHeaders",value:function(e){return void 0!==e&&e.length>0}}]),e}();e.exports=s}).call(t,n(2))},function(e,t,n){"use strict";(function(t){function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=function(){function e(t){n(this,e),this.abHost=t}return r(e,[{key:"send",value:function(e,n){t.navigator.sendBeacon(this.abHost+e,JSON.stringify(n))}}]),e}();e.exports=i}).call(t,n(2))},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(0),a=n(14),s=n(15),u=function(){function e(t,n){r(this,e),this.server=t,this.horizonClient=n,this.mabEndpoint=new a(this.server,this.horizonClient)}return i(e,[{key:"increment",value:function(e){var t=e.experiment,n=e.arm,r=e.testId,i=e.abAlternative;new s({experiment:t,arm:n,testId:r,abAlternative:i},this).increment()}},{key:"reward",value:function(e){var t=e.experiment,n=e.arm,r=e.testId,i=e.abAlternative;new s({experiment:t,arm:n,testId:r,abAlternative:i},this).reward()}},{key:"choose",value:function(e,t){var n=this,r=o.validated(t);return new Promise(function(t,i){n.mabEndpoint.getSelectedArm(e,r,function(i){var o=s.parseRequest(i.responseText,e,n);r.isSkippedImpression()||n.mabEndpoint.recordHorizon("increment",o),t(o)},function(e){i(e)})})}}]),e}();e.exports=u},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(1),a=n(4),s=function(){function e(t,n){r(this,e),this.abHost=t,this.horizonClient=n,this.request=new o(this.abHost),n&&(this.horizonWrapper=new a(this.horizonClient))}return i(e,[{key:"getSelectedArm",value:function(e,t,n,r){var i="",o="GET";t.isSkippedImpression()?i="/mab/"+e+"/choose":(i="/mab/"+e+"/chooseAndIncrement",o="POST"),this.request.do(o,i,null,null,n,r)}},{key:"recordMABMetric",value:function(e,t){var n="/mab/"+t.experiment+"/"+e,r={arm:t.arm,testId:t.testId,abAlternative:t.abAlternative};this.request.do("POST",n,{},r),this.recordHorizon(e,t)}},{key:"recordHorizon",value:function(e,t){this.horizonWrapper&&this.horizonWrapper.send("mab",{metricId:e,algorithm:"ucb1",experiment:t.experiment,arm:t.arm,testId:t.testId})}}]),e}();e.exports=s},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(){function e(t,n){var i=t.experiment,o=t.arm,a=t.testId,s=t.abAlternative;r(this,e),this.experiment=i,this.arm=o,this.testId=a,this.abAlternative=s,this.context=n}return i(e,[{key:"increment",value:function(){this._sendMetric("increment")}},{key:"reward",value:function(){this._sendMetric("reward")}},{key:"_sendMetric",value:function(e){var t={experiment:this.experiment,arm:this.arm,testId:this.testId,abAlternative:this.abAlternative};this.context.mabEndpoint.recordMABMetric(e,t)}}],[{key:"parseRequest",value:function(t,n,r){var i=JSON.parse(t);return i.experiment=n,new e(i,r)}}]),e}();e.exports=o},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(17),a=n(18),s=n(0),u=n(6),l=function(){function e(t,n){r(this,e),this.server=t,this.horizonClient=n,this.abEndpoint=new a(this.server,this.horizonClient),this.googleAnalytics=new u}return i(e,[{key:"choose",value:function(e,t){var n=this,r=s.validated(t);return new Promise(function(t,i){n.abEndpoint.selectedDrawedExperiment(e,r,function(e){var r=o.parseRequest(e.responseText,n);t(r)},function(e){i(e)})})}}]),e}();e.exports=l},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(5),a=function(){function e(){r(this,e)}return i(e,null,[{key:"parseRequest",value:function(e,t){var n=JSON.parse(e),r=Object.keys(n)[0],i=n[r],a=i.alternative,s=i.testId;return new o({experiment:r,alternative:a,testId:s},t)}}]),e}();e.exports=a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(1),u=n(3),l=function(e){function t(e){r(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.abHost=e,n.request=new s(n.abHost),n}return o(t,e),a(t,[{key:"selectedDrawedExperiment",value:function(e,t,n,r){this.request.do("GET","/ab/location/"+e,t.getLocationParams(),null,n,r)}}]),t}(u);e.exports=l},function(e,t){},function(e,t){},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t,n,r){var i=e.id,o=e.content,s=e.tenantId,d=e.feedId,f=function(e){if(r)try{r.send(e)}catch(t){console.log("Erro ao enviar dados para o horizon:",e),console.error(t)}},v=!0,p=!1;i="b"+i;var h=document.createElement("div");h.classList.add("post-stories"),t.appendChild(h);var m=document.createElement("div");m.classList.add("post-stories-header"),m.insertAdjacentHTML("afterbegin","\n    <h3>Stories em destaque</h3>\n    <h4>Confira as novidades</h4>\n  "),h.appendChild(m);var y=document.createElement("div");h.appendChild(y),y.id=i;var g=o.stories.map(function(e,t){var n=void 0,r=e.title||"";r=l(r);var d="story-"+i+"-"+r+"-"+t;try{e.image.sizes.small.url?(n=e.image.sizes.small.url,v=!1):(n=c[s],v=!0)}catch(e){n=c[s],v=!0}var f={storyPosition:t+1,totalSlides:e.slides.length,totalStories:o.stories.length,slideId:e.slides[0].slide.image.id,slideCurrentPosition:1,slideCaption:e.slides[0].slide.legend||null,slideType:"photo",slideLink:e.slides[0].slide.url||null};return(0,u.default)("impression",d+" | "+f.storyPosition+" | "+f.totalSlides+" | "+f.totalStories+" | "+f.slideId+" | "+f.slideCurrentPosition+" | 8 | "+f.slideCaption+" | "+f.slideType+" | "+f.slideLink),{id:d,photo:n,name:e.title,storyPosition:t+1,link:"",lastUpdated:"",items:e.slides.map(function(e,t){if(e&&e.slide&&e.slide.image&&e.slide.image.sizes)return a.default.buildItem(e.slide.image.id,"photo",8,e.slide.image.sizes.medium.url,e.slide.image.sizes.small.url,e.slide.url,e.slide.legend,!1,null)})}}),b=void 0;new a.default(h,y,{id:i,skin:"snapssenger",avatars:!1,list:!1,openEffect:!1,cubeEffect:!1,autoFullScreen:!0,backButton:!1,backNative:!1,previousTap:!0,tenantId:s,useDefaultLogo:v,stories:g,callbacks:{onOpen:function(e,t,r){n&&!p&&(p=!0,n.conversion()),(0,u.default)("view",e+" | "+t.storyPosition+" | "+t.totalSlides+" | "+t.totalStories+" | "+t.slideId+" | "+t.slideCurrentPosition+" | 8 | "+t.slideCaption+" | "+t.slideType+" | "+t.slideLink),r()},onView:function(e,t,n,r){!n||n.type},onEnd:function(e,t){t()},onLinkClick:function(e,t){(0,u.default)("click",e+" | "+t.storyPosition+" | "+t.totalSlides+" | "+t.totalStories+" | "+t.slideId+" | "+t.slideCurrentPosition+" | 8 | "+t.slideCaption+" | "+t.slideType+" | "+t.slideLink);var n={id:"stories-click",version:"1.0",contentType:"feed",properties:{feedId:d,postId:i,storyId:t.storyId,slideId:t.slideId,urlLink:t.slideLink,clickAction:"l"}};f(n)},onClose:function(e,t,n){(0,u.default)("close",e+" | "+t.storyPosition+" | "+t.totalSlides+" | "+t.totalStories+" | "+t.slideId+" | "+t.slideCurrentPosition+" | 8 | "+t.slideCaption+" | "+t.slideType+" | "+t.slideLink),n()},onItemView:function(e,t,n,r){b=Date.now(),!n||n.type},onItemEnd:function(e,t,n,r){b=Date.now()-b;var o={id:"stories-slide-view",version:"1.0",contentType:"feed",properties:{feedId:d,postId:i,storyId:t.storyId,slideId:t.slideId,link:"null"!==t.slideLink,slideViewTime:b,slideType:"photo"===t.slideType?"f":"v",slideLabel:t.slideCaption,slidePosition:t.slideCurrentPosition,slideTotal:t.totalSlides,storyLabel:t.storyLabel,storyPosition:t.storyPosition,storyTotal:t.totalStories}};if(f(o),n&&"animationend"!==n.type){var a="next"===r?"f":"b";r||(a="click"===n.type?"c":"f");var s={id:"stories-click",version:"1.0",contentType:"feed",properties:{feedId:d,postId:i,storyId:t.storyId,slideId:t.slideId,urlLink:t.slideLink,clickAction:a}};f(s)}},onNavigateItem:function(e,t,n){n()}},language:{unmute:"Touch to unmute",keyboardTip:"Press space to see next",visitLink:"Visit link",time:{ago:"atrás",hour:"hora",hours:"horas",minute:"minuto",minutes:"minutos",fromnow:"agora",seconds:"segundos",yesterday:"ontem",tomorrow:"amanhã",days:"dias"}}})}Object.defineProperty(t,"__esModule",{value:!0});var o=n(22),a=r(o),s=n(23),u=r(s),l=function(e){var t="àáãäâåèéëêìíïîòóöôõùúüûñçńǹśşğǵḧŕṕẃḿǘẍźÿý",n=new RegExp(t.split("").join("|"),"g");return e.toString().toLowerCase().replace(/[\s_]+/g,"-").replace(n,function(e){return"aaaaaaeeeeiiiiooooouuuuncnnssgghrpwmuxzyy".charAt(t.indexOf(e))}).replace(/[^\w-]+/g,"").replace(/--+/g,"-").replace(/^-+/,"").replace(/-+$/,"")},c={gshow:"https://s3.glbimg.com/cdn/fn/svgs/latest/gshow/gshow_smile_primario.min.svg",ge:"https://s3.glbimg.com/v1/AUTH_05f06ca986b54d6e9c5df94927ccf7fc/fn/svgs/latest/ge/globoesporte_secundario_branco.min.svg",g1:"https://s3.glbimg.com/v1/AUTH_05f06ca986b54d6e9c5df94927ccf7fc/fn/svgs/latest/g1/g1_primario_branco.min.svg.svg"};t.default=i},function(e,t,n){"use strict";var r;!function(i){var o=function(){var e=window,t=function(t,n,r){var i=document,o=this,a={data:{},lastEvent:null,update:function(e){var t=o.internalData.currentStory,n=o.data[t].currentItem;if(!o.data[t]||!n&&"number"!=typeof n)return console.log("could not update zuckCurrentData."),null;a.lastEvent=e,a.data={storyId:t,storyLabel:o.data[t].name,storyPosition:parseInt(o.data[t].storyPosition,10),slideId:o.data[t].items[n].id,slideCurrentPosition:parseInt(n,10)+1,slideCaption:o.data[t].items[n].linkText,slideType:o.data[t].items[n].type,slideLink:o.data[t].items[n].link||"null",totalSlides:o.data[t].items.length,totalStories:Object.keys(o.data).length}}};"string"==typeof n&&(n=i.getElementById(n));var s=function(e){return i.querySelectorAll(e)[0]},u=function(e,t){return e?e[t]||"":""},l=function(e,t){if(e)for(var n=e.length,r=0;r<n;r++)t(r,e[r])},c=function(e,t,n){var r=[t.toLowerCase(),"webkit"+t,"MS"+t,"o"+t];l(r,function(t,r){e[r]=n})},d=function(e,t,n){var r=[n.toLowerCase(),"webkit"+n,"MS"+n,"o"+n];l(r,function(n,r){e.addEventListener(r,t,!1)})},f=function(e,t){d(e,t,"AnimationEnd")},v=function(e,t){e.transitionEndEvent||(e.transitionEndEvent=!0,d(e,t,"TransitionEnd"))},p=function(e,t){e.firstChild?e.insertBefore(t,e.firstChild):e.appendChild(t)},h=function(e,t,n,r){var i=t>0?1:-1,o=Math.abs(t)/s(".zuck-modal").offsetWidth*90*i;if(E("cubeEffect")){var a=0==o?"scale(0.95)":"scale(0.930,0.930)";if(c(s(".zuck-modal-content").style,"Transform",a),o<-90||o>90)return!1}var u=E("cubeEffect")?"rotateY("+o+"deg)":"translate3d("+t+"px, 0, 0)";e&&(c(e.style,"TransitionTimingFunction",r),c(e.style,"TransitionDuration",n+"ms"),c(e.style,"Transform",u))},m=function(e,t,n,r){var i=0,o=0;if(e){if(e.offsetParent)do{if(i+=e.offsetLeft,o+=e.offsetTop,e==r)break}while(e=e.offsetParent);t&&(o-=t),n&&(i-=n)}return[i,o]},y=function(e){e=1e3*Number(e);var t=new Date(e),n=t.getTime(),r=((new Date).getTime()-n)/1e3,i=E("language","time"),o=[[60," "+i.seconds,1],[120,"1 "+i.minute,""],[3600," "+i.minutes,60],[7200,"1 "+i.hour,""],[86400," "+i.hours,3600],[172800," "+i.yesterday,""],[604800," "+i.days,86400]],a=1;r<0&&(r=Math.abs(r),a=2);for(var s=0,u=void 0;u=o[s++];)if(r<u[0])return"string"==typeof u[2]?u[a]:Math.floor(r/u[2])+u[1];return t.getDate()+"/"+(t.getMonth()+1)+"/"+t.getFullYear()},g=n.id,b={skin:"snapgram",avatars:!0,stories:[],backButton:!0,backNative:!1,previousTap:!0,autoFullScreen:!1,openEffect:!0,cubeEffect:!1,list:!1,localStorage:!0,callbacks:{onOpen:function(e,t){t()},onView:function(e,t){},onEnd:function(e,t){t()},onClose:function(e,t){t()},onNextItem:function(e,t,n){n()},onNavigateItem:function(e,t,n){n()}},language:{unmute:"Touch to unmute",keyboardTip:"Press space to see next",visitLink:"Visit link",time:{ago:"ago",hour:"hour ago",hours:"hours ago",minute:"minute ago",minutes:"minutes ago",fromnow:"from now",seconds:"seconds ago",yesterday:"yesterday",tomorrow:"tomorrow",days:"days ago"}}},E=function(e,t){var n=function(e){return void 0!==e};return t?n(r[e])&&n(r[e][t])?r[e][t]:b[e][t]:n(r[e])?r[e]:b[e]},w=function(){var r=n.getElementsByClassName("zuck-modal")[0];r&&r.length||(r=i.createElement("div"),r.className="zuck-modal",E("cubeEffect")&&(r.className="with-cube"),r.innerHTML="<div class='zuck-modal-content'></div>",r.style.display="none",r.setAttribute("tabIndex","1"),r.onkeyup=function(e){var t=e.keyCode;27==t?I.close():13!=t&&32!=t||I.next()},E("openEffect")&&r.classList.add("with-effects"),v(r,function(){r.classList.contains("closed")&&(c.innerHTML="",r.style.display="none",r.classList.remove("closed"),r.classList.remove("animated"))}),t.insertAdjacentElement("afterbegin",r));var c=r.getElementsByClassName("zuck-modal-content")[0],d=function(e,t){var n=s("#zuck-modal-slider-"+g),i="",u="",l="0",c={previous:r.querySelector(".story-viewer.previous"),next:r.querySelector(".story-viewer.next"),viewing:r.querySelector(".story-viewer.viewing")};if(!c.previous&&!e||!c.next&&e)return!1;e?(i="next",u="previous"):(i="previous",u="next"),E("cubeEffect")?"previous"==i?l=r.slideWidth:"next"==i&&(l=-1*r.slideWidth):(l=m(c[i]),l=-1*l[0]),h(n,l,600,null),setTimeout(function(){if(""!=i&&c[i]&&""!=u){var e=c[i].getAttribute("data-story-id");o.internalData.currentStory=e;var s=r.querySelector(".story-viewer."+u);s&&s.parentNode.removeChild(s),c.viewing&&(c.viewing.classList.add("stopped"),c.viewing.classList.add(u),c.viewing.classList.remove("viewing")),c[i]&&(c[i].classList.remove("stopped"),c[i].classList.remove(i),c[i].classList.add("viewing"));var l=S(i);l&&b(l,i);var d,v=o.internalData.currentStory,p=r.querySelector("[data-story-id='"+v+"']");if(p){p=p.querySelectorAll("[data-index].active");var m=p[0].firstElementChild;d=p[0].getAttribute("data-index"),o.data[v].currentItem=parseInt(d,10),p[0].innerHTML="<b style='"+m.style.cssText+"'></b>",f(p[0].firstElementChild,function(){o.nextItem(!1)})}if(h(n,"0",0,null),p&&_([p[0],p[1]],!0),a.lastEvent===t)return;E("callbacks","onItemEnd")(a.data.storyId,a.data,t,i),a.update(t),E("callbacks","onView")(v,a.data,t,i),E("callbacks","onItemView")(a.data.storyId,a.data,t,i)}},650)},b=function(e,t,n){var a=s("#zuck-modal-slider-"+g),c="",d="",v=u(e,"id"),h=i.createElement("div"),m=u(e,"currentItem")||0,b=r.querySelector(".story-viewer[data-story-id='"+v+"']"),w="";if(b)return!1;h.className="slides",l(u(e,"items"),function(t,n){m>t&&(e.items[t].seen=!0,n.seen=!0);var r=u(n,"length"),i=u(n,"linkText"),o=u(n,"link"),a=!0===u(n,"seen")?"seen":"",s="data-index='"+t+"' data-item-id='"+u(n,"id")+"'";m===t&&(w=y(u(n,"time"))),d+="<span "+s+" class='"+(m===t?"active":"")+" "+a+"' > <b style='animation-duration:"+(""===r?"3":r)+"s' ></b ></span > ",c+="<div data-time='"+u(n,"time")+"' data-type='"+u(n,"type")+"' data-item-id='"+u(n,"id")+"'"+s+" class='item "+a+" "+(m===t?"active":"")+"' > "+("video"===u(n,"type")?"<video class='media' muted webkit-playsinline playsinline preload='auto' src='"+u(n,"src")+"' "+u(n,"type")+"></video><b class='tip muted'>"+E("language","unmute")+"</b>":"<img class='media' src='"+u(n,"src")+"' "+u(n,"type")+">")+"<div class='"+(o?"content with-link":"content")+"'>"+(i?"<span class='text' >"+i+"</span>":"")+(o?"<a class='link' href='"+o+"'><span>Ver matéria</span></a>":"")+"</div></div>"}),h.innerHTML=c;var k=h.querySelector("video"),T=function(e){e.muted?S.classList.add("muted"):S.classList.remove("muted")};k&&(k.onwaiting=function(e){k.paused&&(S.classList.add("paused"),S.classList.add("loading"))},k.onplay=function(){T(k),S.classList.remove("stopped"),S.classList.remove("paused"),S.classList.remove("loading")},k.onready=k.onload=k.onplaying=k.oncanplay=function(){T(k),S.classList.remove("loading")},k.onvolumechange=function(){T(k)});var S=i.createElement("div");S.className="story-viewer muted "+t+" "+(n?"":"stopped")+" "+(E("backButton")?"with-back-button":""),S.setAttribute("data-story-id",v);var A="<div class='slides-pointers'><div>"+d+"</div></div><div class='head'><div class='left'>"+(E("backButton")?"<a class='back'>&lsaquo;</a>":"")+'<u class="img'+(E("useDefaultLogo")?" logo-"+E("tenantId"):"")+"\" style='background-image: url("+u(e,"photo")+");'></u > <div><strong>"+u(e,"name")+"</strong></div></div > <div class='right'><span class='time'>"+w+"</span><span class='loading'></span><a class='close' tabIndex='2'>&times;</a></div></div >";S.innerHTML=A,l(S.querySelectorAll(".close, .back"),function(e,t){t.onclick=function(e){e.preventDefault(),I.close()}}),S.appendChild(h),"viewing"==t&&_(S.querySelectorAll("[data-index='"+m+"'].active"),!1),l(S.querySelectorAll(".slides-pointers [data-index] > b"),function(e,t){f(t,function(){o.nextItem(!1)})}),"previous"==t?p(a,S):a.appendChild(S)},w=function(t){var n=t,i={},s=void 0,u=void 0,l=void 0,c=void 0,f=void 0,v=function(e){var t=r.getElementsByClassName("viewing")[0];if("A"==e.target.nodeName||"A"==e.target.parentNode.nodeName)return(e.target.classList.contains("link")||e.target.parentNode.classList.contains("link"))&&E("callbacks","onLinkClick")(a.data.storyId,a.data),!0;e.preventDefault();var o=e.touches?e.touches[0]:e,d=m(t);r.slideWidth=r.getElementsByClassName("story-viewer")[0].offsetWidth,i={x:d[0],y:d[1]};var v=o.pageX,h=o.pageY;s={x:v,y:h,time:Date.now()},u=void 0,l={},n.addEventListener("mousemove",p),n.addEventListener("mouseup",y),n.addEventListener("mouseleave",y),n.addEventListener("touchmove",p),n.addEventListener("touchend",y),t&&t.classList.add("paused"),O(),c=setTimeout(function(){t.classList.add("longPress")},600),f=setTimeout(function(){clearInterval(f),f=!1},250)},p=function(e){var t=e.touches?e.touches[0]:e,r=t.pageX,o=t.pageY;s&&(l={x:r-s.x,y:o-s.y},void 0===u&&(u=!!(u||Math.abs(l.x)<Math.abs(l.y))),!u&&s&&(e.preventDefault(),h(n,i.x+l.x,0,null)))},y=function t(a){var v=r.getElementsByClassName("viewing")[0],m=s;if(l){var y=s?Date.now()-s.time:void 0,g=Number(y)<300&&Math.abs(l.x)>25||Math.abs(l.x)>r.slideWidth/3,b=l.x<0,w=b?r.querySelector(".story-viewer.next"):r.querySelector(".story-viewer.previous"),I=b&&!w||!b&&!w;u||(g&&!I?d(b,a):h(n,i.x,300)),s=void 0,n.removeEventListener("mousemove",p),n.removeEventListener("mouseup",t),n.removeEventListener("mouseleave",t),n.removeEventListener("touchmove",p),n.removeEventListener("touchend",t)}var k=o.internalData.currentVideoElement;if(c&&clearInterval(c),v&&(v.classList.remove("longPress"),v.classList.remove("paused")),f){clearInterval(f),f=!1;var T=function(){m.x>e.screen.width/3||!E("previousTap")?o.navigateItem("next",a):o.navigateItem("previous",a)};if(!v||!k)return T(),!1;v.classList.contains("muted")?x(k,v):T()}};n.addEventListener("touchstart",v),n.addEventListener("mousedown",v)},k=function(){return document.exitFullscreen?void document.exitFullscreen():document.mozCancelFullScreen?void document.mozCancelFullScreen():document.webkitExitFullscreen?void document.webkitExitFullscreen():void 0},T=function(e){return e.requestFullScreen?"":e.msRequestFullScreen?"ms":e.mozRequestFullScreen?"moz":e.webkitRequestFullScreen?"webkit":void 0},R=function(e){Boolean(document.fullscreenElement||document.webkitIsFullScreen||document.mozFullScreen||document.msFullscreenElement)||I.close()},L=function(e){e.addEventListener(T(e)+"fullscreenchange",R,!1)},N=function(e){e.removeEventListener(T(e)+"fullscreenchange",R,!1)},D=function(e){var t=T(e),n=t?t+"RequestFullScreen":"requestFullScreen";try{L(e),e[n]()}catch(e){console.log(e)}};return{show:function(t,n){var i=function(){c.innerHTML="<div id='zuck-modal-slider-"+g+"' class='slider'></div>";var n=o.data[t],i=n.currentItem||0,u=s("#zuck-modal-slider-"+g);w(u),window.addEventListener("resize",function(e){window.innerHeight-u.offsetHeight!=0&&(u.style.height=window.innerHeight+"px")},!0);var l=document.createEvent("HTMLEvents");l.initEvent("resize",!1,!1),window.dispatchEvent(l),o.internalData.currentStory=t,n.currentItem=i,E("backNative")&&(location.hash="#!"+g);var d=S("previous");d&&b(d,"previous"),b(n,"viewing",!0);var f=S("next");f&&b(f,"next"),E("autoFullScreen")&&r.classList.add("fullscreen");var v=function(){r.classList.contains("fullscreen")&&E("autoFullScreen")&&e.screen.width<=1024&&D(r),r.focus()};if(E("openEffect")){var p=s("#"+g+" [data-id='"+t+"'] .img"),h=m(p);r.style.marginLeft=h[0]+p.offsetWidth/2+"px",r.style.marginTop=h[1]+p.offsetHeight/2+"px",r.style.display="block",r.slideWidth=r.getElementsByClassName("story-viewer")[0].offsetWidth,setTimeout(function(){r.classList.add("animated")},10),setTimeout(function(){v()},300)}else r.style.display="block",r.slideWidth=r.getElementsByClassName("story-viewer")[0].offsetWidth,v();document.body.style.overflow="hidden",a.update(),E("callbacks","onView")(t,a.data,!1,!1),E("callbacks","onItemView")(a.data.storyId,a.data,!1,!1)},u=o.data[t].currentItem||0,l={storyPosition:o.data[t].storyPosition,totalSlides:o.data[t].items.length,totalStories:Object.keys(o.data).length,slideId:o.data[t].items[u].id,slideCurrentPosition:u+1,slideCaption:o.data[t].items[u].linkText||"null",slideType:o.data[t].items[u].type,slideLink:o.data[t].items[u].link||"null"};E("callbacks","onOpen")(t,l,i)},next:function(e){var t=function(){var e=o.internalData.currentStory,t=s("#"+g+" [data-id='"+e+"']");t&&(t.classList.add("seen"),o.data[e].seen=!0,o.internalData.seenItems[e]=!0,C("seenItems",o.internalData.seenItems),A()),r.querySelector(".story-viewer.next")?d(!0,event):I.close()};E("callbacks","onEnd")(o.internalData.currentStory,t)},close:function(){var e=function(){E("backNative")&&(location.hash=""),E("openEffect")?r.classList.add("closed"):(c.innerHTML="",r.style.display="none"),document.body.style.overflow="initial",N(r),k()};E("callbacks","onItemEnd")(a.data.storyId,a.data,event,!1),E("callbacks","onClose")(a.data.storyId,a.data,e)}}},I=new w,k=function(e){var t=e.getAttribute("data-id"),n=i.querySelectorAll("#"+g+" [data-id='"+t+"'] .items > li"),r=[];l(n,function(e,t){var n=t.firstElementChild,i=n.firstElementChild;r.push({id:n.getAttribute("data-item-id"),src:n.getAttribute("href"),length:n.getAttribute("data-length"),type:n.getAttribute("data-type"),time:n.getAttribute("data-time"),link:n.getAttribute("data-link"),linkText:n.getAttribute("data-linkText"),preview:i.getAttribute("src")})}),o.data[t].items=r},T=function(e){var t=e.getAttribute("data-id"),n=!1;o.internalData.seenItems[t]&&(n=!0),n?e.classList.add("seen"):e.classList.remove("seen");try{o.data[t]={id:t,photo:e.getAttribute("data-photo"),name:e.firstElementChild.lastElementChild.firstChild.innerText,link:e.firstElementChild.getAttribute("href"),lastUpdated:e.getAttribute("data-last-updated"),storyPosition:e.getAttribute("data-story-position"),seen:n,items:[]}}catch(e){o.data[t]={items:[]}}e.onclick=function(e){e.preventDefault(),I.show(t)}},S=function(e){var t=o.internalData.currentStory,n=e+"ElementSibling";if(t){var r=s("#"+g+" [data-id='"+t+"']")[n];if(r){var i=r.getAttribute("data-id");return o.data[i]||!1}}return!1},A=function(){l(i.querySelectorAll("#"+g+" .story.seen"),function(e,t){var n=o.data[t.getAttribute("data-id")];t.parentNode.removeChild(t),o.add(n,!0)})},_=function(e,t){var n=e[1],r=e[0],i=r.parentNode.parentNode.parentNode;if(!n||!r)return!1;var a=o.internalData.currentVideoElement;if(a&&a.pause(),"video"==n.getAttribute("data-type")){var s=n.getElementsByTagName("video")[0];if(!s)return o.internalData.currentVideoElement=!1,!1;var u=function(){s.duration&&c(r.getElementsByTagName("b")[0].style,"AnimationDuration",s.duration+"s")};u(),s.addEventListener("loadedmetadata",u),o.internalData.currentVideoElement=s,s.currentTime=0,s.play(),t.target&&x(s,i)}else o.internalData.currentVideoElement=!1},O=function(){var e=o.internalData.currentVideoElement;if(e)try{e.pause()}catch(e){console.log(e)}},x=function(e,t){e.muted=!1,e.volume=1,e.removeAttribute("muted"),e.play(),e.paused&&(e.muted=!0,e.play()),t&&t.classList.remove("paused")},C=function(t,n){try{if(E("localStorage")){var r="zuck-"+g+"-"+t;e.localStorage[r]=JSON.stringify(n)}}catch(e){console.log(e)}},R=function(e){var t={"'":"&apos;","&":"&amp;",">":" &gt;","<":"&lt; ",'"':"&quot;","©":"&copy;"},n=Object.keys(t).join("").replace("\\",""),r=new RegExp("["+n+"]","g");return e.replace(r,function(e){return t[e]})};return o.data={},o.internalData={},o.internalData.seenItems=function(t){if(E("localStorage")){var n="zuck-"+g+"-seenItems";return!!e.localStorage[n]&&JSON.parse(e.localStorage[n])}return!1}()||{},o.add=o.update=function(e,t){var r=u(e,"id"),a=s("#"+g+" [data-id='"+r+"']"),c="",d=u(e,"items"),f=!1;o.data[r]={},a?f=a:(f=i.createElement("div"),f.className="story"),!1===e.seen&&(o.internalData.seenItems[r]=!1,C("seenItems",o.internalData.seenItems)),f.setAttribute("data-id",r),f.setAttribute("data-photo",u(e,"photo")),f.setAttribute("data-last-updated",u(e,"lastUpdated")),f.setAttribute("data-story-position",u(e,"storyPosition"));var v=!1;d[0]&&(v=d[0].preview||""),c="<a href='"+u(e,"link")+"'> <span class='img'><u style=\"background-image:url('"+(E("avatars")||!v||""==v?u(e,"photo"):v)+"');\" ></u></span > <span class='info'><strong>"+u(e,"name")+"</strong><span class='time'>"+y(u(e,"lastUpdated"))+"</span></span></a > <ul class='items'></ul>",f.innerHTML=c,T(f),a||(t?n.appendChild(f):p(n,f)),l(d,function(e,n){o.addItem(r,n,t)}),t||A()},o.next=function(){I.next()},o.remove=function(e){var t=s("#"+g+' > [data-id="'+e+'"]');t.parentNode.removeChild(t)},o.addItem=function(e,t,n){var r=s("#"+g+' > [data-id="'+e+'"]'),o=i.createElement("li");o.className=u(t,"seen")?"seen":"",o.setAttribute("data-id",u(t,"id")),o.innerHTML='<a href="'+u(t,"src")+'"\n          data-link="'+u(t,"link")+'"\n          data-linkText="'+R(u(t,"linkText"))+'"\n          data-item-id="'+u(t,"id")+'"\n          data-time="'+u(t,"time")+'"\n          data-type="'+u(t,"type")+'"\n          data-length="'+u(t,"length")+'">\n          <img src="'+u(t,"preview")+'" />\n        </a>';var a=r.querySelectorAll(".items")[0];n?a.appendChild(o):p(a,o),k(r)},o.removeItem=function(e,t){var r=s("#"+g+" > [data-id='"+e+"'] [data-id='"+t+"']");n.parentNode.removeChild(r)},o.navigateItem=o.nextItem=function(e,t){var n=o.internalData.currentStory,r=o.data[n].currentItem,i=s(".zuck-modal .story-viewer[data-story-id='"+n+"']"),u="previous"==e?-1:1;if(!i||1==i.touchMove)return!1;var c=i.querySelectorAll("[data-index='"+r+"']"),d=c[0],f=c[1],v=r+u,p=i.querySelectorAll("[data-index='"+v+"']"),h=p[0],m=p[1];if(i&&h&&m){var g=function(){"previous"==e?(d.classList.remove("seen"),f.classList.remove("seen")):(d.classList.add("seen"),f.classList.add("seen")),d.classList.remove("active"),f.classList.remove("active"),h.classList.remove("seen"),h.classList.add("active"),m.classList.remove("seen"),m.classList.add("active"),l(i.querySelectorAll(".time"),function(e,t){t.innerText=y(m.getAttribute("data-time"))}),o.data[n].currentItem=o.data[n].currentItem+u,_(p,t)},b=E("callbacks","onNavigateItem");b=b?E("callbacks","onNavigateItem"):E("callbacks","onNextItem"),b(n,m.getAttribute("data-story-id"),g),E("callbacks","onItemEnd")(a.data.storyId,a.data,t,e),a.update(t),E("callbacks","onItemView")(a.data.storyId,a.data,t,e)}else i&&"previous"!=e&&I.next(t)},function(){location.hash=="#!"+g&&(location.hash=""),s("#"+g+" .story")&&l(n.querySelectorAll(".story"),function(e,t){T(t)}),E("backNative")&&e.addEventListener("popstate",function(e){location.hash!="#!"+g&&(location.hash="")},!1),l(E("stories"),function(e,t){o.add(t,!0)}),A();var t=E("avatars")?"user-icon":"story-preview",r=E("list")?"list":"carousel";return n.className="stories "+t+" "+r+" "+(E("skin")+"").toLowerCase(),o}()};return t.buildItem=function(e,t,n,r,i,o,a,s,u){return{id:e,type:t,length:n,src:r,preview:i,link:o,linkText:a,seen:s,time:u}},e.ZuckitaDaGalera=e.Zuck=t,t}();void 0!==(r=function(){return o}.call(t,n,t,e))&&(e.exports=r)}()},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){try{window.ga(i+"_portal.send","event",r,e,t)}catch(e){console.error(e)}};var r="post stories",i=window.cdaaas.SETTINGS.SITE_ID},function(e,t,n){!function(t,n){e.exports=function(){return function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=3)}([function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=r(n(7)),o={EVENTS_BUFFER_SIZE:100,EVENTS_SENDER_INTERVAL:1e4,EVENTS_SENDER_MIN_INTERVAL:5e3,EVENTS_SENDER_MAX_INTERVAL:2e4,EVENTS_DISCARD_AFTER_MSECS:36e5,EVENTS_BULK_SIZE:10,HORIZON_TRACK_HOST:"https://horizon-track.globo.com",HORIZON_SCHEMAS_HOST:"https://horizon-schemas.globo.com",HORIZON_CALLBACK_STACK_LIMIT:1e3,HORIZON_REQUEST_ENCODING:"base64",HORIZON_CLIENT_UUID:r(n(2)).default.getResource("clientInstanceUUID",(0,i.default)()),SCHEMA_VALIDATOR_SCRIPT_URL:"https://s3.glbimg.com/cdn/libs/tv4/1.3.0/tv4.min.js",SCHEMA_VALIDATOR_SCRIPT_MAX_RETRIES:2,SCHEMA_LOAD_COLLECTION_RETRY_AFTER_MSECS:1e4,PACKAGE_VERSION:"1.0.3"},a={useQAConfiguration:function(){o.HORIZON_TRACK_HOST="https://horizon-track.qa.globoi.com",o.HORIZON_SCHEMAS_HOST="https://horizon-schemas.qa.globoi.com",o.HORIZON_REQUEST_ENCODING="json"}};t.default=Object.assign(o,a)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={DUPLICATED_SCHEMA:"[Horizon] Duplicated schema.",INVALID_DATA:"[Horizon] Invalid data.",INVALID_DATE:"[Horizon] Invalid date-time RFC 3339 format.",INVALID_FORMAT:"[Horizon] Invalid event format.",INVALID_REQUEST:"[Horizon] Invalid request.",INVALID_TIMESTAMP:"[Horizon] Invalid timestamp.",INVALID_VERSION_FORMAT:"[Horizon] Invalid version format.",UNSUPPORTED_TYPE:"[Horizon] Unsupported type.",UNSUPPORTED_TENANT:"[Horizon] Unsupported tenant.",UNSUPPORTED_ENCODER:"[Horizon] Unsupported encoder.",MUST_BE_DEFINED:"[Horizon] Parameter or argument must be defined",ERROR_LOADING_RESOURCE:"[Horizon] Failed to load resouce.",COMPONENT_NOT_READY:"[Horizon] Component is not ready.",COMPONENT_UNAVAILABLE:"[Horizon] Class or function is required.",SCHEMA_VALIDATOR_ERROR_LOADING:"[Horizon] Could not load SchemaValidator.",LIMIT_EXCEEDED:"[Horizon] Resource limit exceeded."},i={mustBeDefined:function(e){throw new Error(r.MUST_BE_DEFINED+": "+e+".")}};t.default=Object.assign(r,i)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){return window.horizonResources=window.horizonResources||{},window.horizonResources};t.default={getContext:r,getResource:function(e,t){var n=r();return n[e]=n[e]||t,n[e]}}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.Settings=t.HorizonClient=void 0,n(4);var i=r(n(6)),o=r(n(0));t.HorizonClient=i.default,t.Settings=o.default},function(e,t,n){"use strict";n(5).polyfill()},function(e,t,n){"use strict";function r(e,t){if(void 0===e||null===e)throw new TypeError("Cannot convert first argument to object");for(var n=Object(e),r=1;r<arguments.length;r++){var i=arguments[r];if(void 0!==i&&null!==i)for(var o=Object.keys(Object(i)),a=0,s=o.length;a<s;a++){var u=o[a],l=Object.getOwnPropertyDescriptor(i,u);void 0!==l&&l.enumerable&&(n[u]=i[u])}}return n}e.exports={assign:r,polyfill:function(){Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:r})}}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=r(n(0)),a=r(n(10)),s=r(n(1)),u=r(n(12)),l=r(n(22)),c={READY:"stateReady",UNLOADED:"stateNotReady",LOADING:"stateLoading"},d=function(){function e(t,n){var r=this,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.tenant=t||s.default.mustBeDefined("tenant"),this.deviceGroup=n||s.default.mustBeDefined("deviceGroup"),this.defaultContentType=i,this.validator=a.default,this.clientVersion=o.default.PACKAGE_VERSION,this.state=c.UNLOADED,this.referer=document.referrer;var d=null,f=null;this.setSchemasProvider=function(e){return d=e},this.getSchemasProvider=function(){if(!d){var e=l.default.getInstance();r.setSchemasProvider(e)}return d},this.setEventBus=function(e){return f=e},this.getEventBus=function(){if(!f){var e=u.default.getInstance(r.tenant,r.deviceGroup);r.setEventBus(e)}return f},this.isReady=function(){return!!d&&r.validator.isReady()&&d.isReady()}}return i(e,[{key:"useDefaultContentType",value:function(e){this.defaultContentType=e}},{key:"setValidator",value:function(e){this.validator=e}},{key:"setReferer",value:function(e){this.referer=e||document.referrer}},{key:"unload",value:function(){this.flush()}},{key:"getScopeInfo",value:function(){return{url:document.location.href,actionTs:+Date.now(),horizonClientVersion:this.clientVersion,horizonClientReferer:this.referer}}},{key:"validateBeforeEnqueue",value:function(e){var t=this.getSchemasProvider().get(e.id,e.version);this.validator.validateFor(e,t)}},{key:"onReady",value:function(e){this.validator.isReady()?this.getSchemasProvider().isReady()?(this.state=c.READY,e()):(this.state=c.LOADING,this.getSchemasProvider().onReady(e),this.getSchemasProvider().load()):(this.state=c.LOADING,this.validator.onReady(e),this.validator.load())}},{key:"flush",value:function(){var e=this;this.isReady()?this.getEventBus().flush():this.onReady(function(){return e.flush()})}},{key:"send",value:function(e){var t=this;if(this.validator.validateArgs(e),!this.isReady())return this.state===c.UNLOADED&&this.flush(),void this.onReady(function(){return t.send(e)});this.validateBeforeEnqueue(e);var n=this.getScopeInfo(),r=Object.assign({},e,n);r.contentType||(this.defaultContentType||s.default.mustBeDefined("contentType"),r.contentType=this.defaultContentType),this.getEventBus().enqueue(r)}}]),e}();t.default=d},function(e,t,n){var r=n(8),i=n(9);e.exports=function(e,t,n){var o=t&&n||0;"string"==typeof e&&(t="binary"===e?new Array(16):null,e=null);var a=(e=e||{}).random||(e.rng||r)();if(a[6]=15&a[6]|64,a[8]=63&a[8]|128,t)for(var s=0;s<16;++s)t[o+s]=a[s];return t||i(a)}},function(e,t){var n="undefined"!=typeof crypto&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&msCrypto.getRandomValues.bind(msCrypto);if(n){var r=new Uint8Array(16);e.exports=function(){return n(r),r}}else{var i=new Array(16);e.exports=function(){for(var e,t=0;t<16;t++)0==(3&t)&&(e=4294967296*Math.random()),i[t]=e>>>((3&t)<<3)&255;return i}}},function(e,t){for(var n=[],r=0;r<256;++r)n[r]=(r+256).toString(16).substr(1);e.exports=function(e,t){var r=t||0,i=n;return i[e[r++]]+i[e[r++]]+i[e[r++]]+i[e[r++]]+"-"+i[e[r++]]+i[e[r++]]+"-"+i[e[r++]]+i[e[r++]]+"-"+i[e[r++]]+i[e[r++]]+"-"+i[e[r++]]+i[e[r++]]+i[e[r++]]+i[e[r++]]+i[e[r++]]+i[e[r++]]}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=r(n(11)),a=r(n(1)),s=r(n(0)),u={ready:[]},l=function(){return!!window.tv4},c=function(e){return null===e?null:isNaN(e)&&!isNaN(Date.parse(e))?null:a.default.INVALID_DATE};t.default={validateFor:function(e,t){if(!l())throw new Error(a.default.ERROR_LOADING_RESOURCE+" Validator is not ready.");if(!t)throw new Error(a.default.INVALID_DATA+" Argument: schema.");if(!/\d+\.\d+/.test(e.version))throw new Error(a.default.INVALID_VERSION_FORMAT);if(!tv4.validate(e.properties,t))throw new Error(a.default.INVALID_DATA+" "+e.id+" "+e.version+". "+tv4.error)},validateArgs:function(e){var t=Object.prototype.hasOwnProperty;if(!(e&&t.call(e,"id")&&t.call(e,"version")&&t.call(e,"properties")))throw new Error(a.default.INVALID_FORMAT+" Missing properties: "+JSON.stringify(e));if("string"!=typeof e.id||"string"!=typeof e.version||"object"!==i(e.properties))throw new Error(a.default.INVALID_FORMAT+" Wrong object type: "+JSON.stringify(e));if(e.id.length<2||e.version.length<3)throw new Error(a.default.INVALID_FORMAT+" Invalid property size: "+JSON.stringify(e));var n=Object.assign({},e);if(delete n.id,delete n.version,delete n.properties,delete n.contentType,Object.keys(n).length>0)throw new Error(a.default.INVALID_FORMAT+" Extra keys aren't allowed: "+JSON.stringify(n))},tv4IsValidData:c,isReady:l,onReady:function(e){if(l())return e();if(u.ready.length>s.default.HORIZON_CALLBACK_STACK_LIMIT)throw new Error(a.default.LIMIT_EXCEEDED+" Validator callback stack.");return u.ready.unshift(e)},load:function(){o.default.isDefined("tv4")||(0,o.default)([s.default.SCHEMA_VALIDATOR_SCRIPT_URL],"tv4",{async:!0,numRetries:s.default.SCHEMA_VALIDATOR_SCRIPT_MAX_RETRIES,success:function(){tv4.addFormat("date-time",c),u.ready.forEach(function(e){return e()})},error:function(e){throw new Error(a.default.SCHEMA_VALIDATOR_ERROR_LOADING+" "+e)}})}}},function(e,t,n){var r,i,o;!function(n,a){i=[],void 0===(o="function"==typeof(r=a)?r.apply(t,i):r)||(e.exports=o)}(0,function(){function e(e,t){if(e){var n=s[e];if(a[e]=t,n)for(;n.length;)n[0](e,t),n.splice(0,1)}}function t(e,t){e.call&&(e={success:e}),t.length?(e.error||i)(t):(e.success||i)(e)}function n(e,t,r,o){var a,s,u=document,l=r.async,c=(r.numRetries||0)+1,d=r.before||i,f=e.replace(/^(css|img)!/,"");o=o||0,/(^css!|\.css$)/.test(e)?(a=!0,(s=u.createElement("link")).rel="stylesheet",s.href=f):/(^img!|\.(png|gif|jpg|svg)$)/.test(e)?(s=u.createElement("img")).src=f:((s=u.createElement("script")).src=e,s.async=void 0===l||l),s.onload=s.onerror=s.onbeforeload=function(i){var u=i.type[0];if(a&&"hideFocus"in s)try{s.sheet.cssText.length||(u="e")}catch(i){u="e"}if("e"==u&&(o+=1)<c)return n(e,t,r,o);t(e,u,i.defaultPrevented)},!1!==d(e,s)&&u.head.appendChild(s)}function r(r,i,a){var s,u;if(i&&i.trim&&(s=i),u=(s?a:i)||{},s){if(s in o)throw"LoadJS";o[s]=!0}!function(e,t,r){var i,o,a=(e=e.push?e:[e]).length,s=a,u=[];for(i=function(e,n,r){if("e"==n&&u.push(e),"b"==n){if(!r)return;u.push(e)}--a||t(u)},o=0;o<s;o++)n(e[o],i,r)}(r,function(n){t(u,n),e(s,n)},u)}var i=function(){},o={},a={},s={};return r.ready=function(e,n){return function(e,t){var n,r,i,o=[],u=(e=e.push?e:[e]).length,l=u;for(n=function(e,n){n.length&&o.push(e),--l||t(o)};u--;)r=e[u],(i=a[r])?n(r,i):(s[r]=s[r]||[]).push(n)}(e,function(e){t(n,e)}),r},r.done=function(t){e(t,[])},r.reset=function(){o={},a={},s={}},r.isDefined=function(e){return e in o},r})},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=r(n(13)),a=r(n(2)),s=r(n(14)),u=r(n(0)),l=r(n(1)),c=r(n(18)),d=r(n(19)),f=r(n(20)),v=function(){return a.default.getResource("bus",{})},p=function(){function e(t,n,r){var i=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.currentTenant=t||l.default.mustBeDefined("tenant"),this.instanceID=n||l.default.mustBeDefined("instanceID"),this.deviceGroup=r||l.default.mustBeDefined("deviceGroup"),this.queue=new c.default(u.default.EVENTS_BUFFER_SIZE),(new d.default).every(u.default.EVENTS_SENDER_INTERVAL).call(function(){i.queue=i.filterQueue();var e=i.prepareRequest();i.dispatch(e,u.default.HORIZON_REQUEST_ENCODING)||e.actions.forEach(function(e){return i.enqueue(e)})}).call(f.default).start()}return i(e,[{key:"setMaxQueueSize",value:function(e){this.queue=c.default.fromArray(this.queue.items,e)}},{key:"filterQueue",value:function(){var e=+Date.now()-u.default.EVENTS_DISCARD_AFTER_MSECS;return this.queue.filter(function(t){return t.actionTs>e})}},{key:"prepareRequest",value:function(){return{horizonClientUUID:this.instanceID,horizonClientTenant:this.currentTenant,horizonClientTs:Date.now(),horizonClientType:"js",horizonClientDeviceGroup:this.deviceGroup,actions:this.queue.splice(0,u.default.EVENTS_BULK_SIZE)}}},{key:"isValidRequest",value:function(e){if(!e||e&&!e.actions)throw new Error(l.default.INVALID_REQUEST);return e.actions.length>0}},{key:"dispatch",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"json",n=u.default.HORIZON_TRACK_HOST+"/event/"+this.currentTenant,r=s.default.get(t);if(!this.isValidRequest(e))return!1;var i=r(e);return(0,o.default)(n,i)}},{key:"enqueue",value:function(e){if(!e.actionTs)throw new Error(l.default.INVALID_TIMESTAMP);this.queue.push(e)}},{key:"flush",value:function(){for(;this.queue.length>0;){this.queue=this.filterQueue();var e=this.prepareRequest();this.dispatch(e,u.default.HORIZON_REQUEST_ENCODING)}}},{key:"length",get:function(){return this.queue.length}}]),e}();t.default={getInstance:function(e,t){var n=v(),r=e+"-"+t;return n[r]||(n[r]=new p(e,u.default.HORIZON_CLIENT_UUID,t)),n[r]},reset:function(e,t){e&&0!==e.length||l.default.mustBeDefined("tenant"),t&&0!==t.length||l.default.mustBeDefined("deviceGroup");var n=e+"-"+t;delete v()[n]},getContextBus:v}},function(e,t,n){!function(n){"use strict";var r="navigator"in n&&"sendBeacon"in n.navigator,i=function(e,t){var n="XMLHttpRequest"in window?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");n.open("POST",e,!1),n.withCredentials=!0,n.setRequestHeader("Accept","*/*"),"string"==typeof t?(n.setRequestHeader("Content-Type","text/plain;charset=UTF-8"),n.responseType="text/plain"):"[object Blob]"==={}.toString.call(t)&&t.type&&n.setRequestHeader("Content-Type",t.type);try{n.send(t)}catch(e){}return!0};r&&(i=navigator.sendBeacon.bind(navigator)),void 0!==e&&e.exports&&(t=e.exports=i),t.sendBeacon=i}("object"==typeof window?window:this)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=r(n(15)),o=r(n(1)),a={base64:function(e){var t=new FormData;return t.append("data",i.default.encode(JSON.stringify(e))),t.append("encoding","base64"),t},json:function(e){return JSON.stringify(e)}};t.default={get:function(e){if(!(e in a))throw new Error(o.default.UNSUPPORTED_ENCODER+" Invalid "+e+" encoder.");return a[e]}}},function(e,t,n){(function(e,r){var i;/*! http://mths.be/base64 v0.1.0 by @mathias | MIT license */!function(r){var o=("object"==typeof e&&e&&e.exports,function(e){this.message=e});(o.prototype=new Error).name="InvalidCharacterError";var a=function(e){throw new o(e)},s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",u=/[\t\n\f\r ]/g,l={encode:function(e){e=String(e),/[^\0-\xFF]/.test(e)&&a("The string to be encoded contains characters outside of the Latin1 range.");for(var t,n,r,i,o=e.length%3,u="",l=-1,c=e.length-o;++l<c;)t=e.charCodeAt(l)<<16,n=e.charCodeAt(++l)<<8,r=e.charCodeAt(++l),u+=s.charAt((i=t+n+r)>>18&63)+s.charAt(i>>12&63)+s.charAt(i>>6&63)+s.charAt(63&i);return 2==o?(t=e.charCodeAt(l)<<8,n=e.charCodeAt(++l),u+=s.charAt((i=t+n)>>10)+s.charAt(i>>4&63)+s.charAt(i<<2&63)+"="):1==o&&(i=e.charCodeAt(l),u+=s.charAt(i>>2)+s.charAt(i<<4&63)+"=="),u},decode:function(e){var t=(e=String(e).replace(u,"")).length;t%4==0&&(t=(e=e.replace(/==?$/,"")).length),(t%4==1||/[^+a-zA-Z0-9\/]/.test(e))&&a("Invalid character: the string to be decoded is not correctly encoded.");for(var n,r,i=0,o="",l=-1;++l<t;)r=s.indexOf(e.charAt(l)),n=i%4?64*n+r:r,i++%4&&(o+=String.fromCharCode(255&n>>(-2*i&6)));return o},version:"0.1.0"};void 0===(i=function(){return l}.call(t,n,t,e))||(e.exports=i)}()}).call(t,n(16)(e),n(17))},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:100;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._queue=[],this.maxSize=t}return r(e,[{key:"push",value:function(e){this._queue=[e].concat(function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(this.slice(0,this.maxSize-1)))}},{key:"forEach",value:function(e){return this._queue.forEach(e)}},{key:"slice",value:function(e,t){return this._queue.slice(e,t)}},{key:"splice",value:function(e,t){return this._queue.splice(e,t)}},{key:"clear",value:function(){this._queue=[]}},{key:"filter",value:function(t){return e.fromArray(this._queue.filter(t),this.maxSize)}},{key:"length",get:function(){return this._queue.length}},{key:"items",get:function(){return JSON.parse(JSON.stringify(this._queue))}}],[{key:"fromArray",value:function(t,n){var r=new e(n);return t.forEach(function(e){return r.push(e)}),r}}]),e}();t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.interval=0,this.tickIntervalId=0,this.callbacks=[]}return r(e,[{key:"tick",value:function(){var e=this;this.callbacks.forEach(function(t){return t(e)})}},{key:"start",value:function(){return this.tickIntervalId=setInterval(this.tick.bind(this),this.interval),this}},{key:"stop",value:function(){return clearInterval(this.tickIntervalId),this.tickIntervalId=0,this}},{key:"reschedule",value:function(e){return this.stop().every(e).start()}},{key:"every",value:function(e){return this.interval=e,this}},{key:"call",value:function(e){return this.callbacks.push(e),this}},{key:"isRunning",get:function(){return!!this.tickIntervalId}}]),e}();t.default=i},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=r(n(21)),o=r(n(0));t.default=function(e){var t=o.default.EVENTS_SENDER_MIN_INTERVAL,n=o.default.EVENTS_SENDER_MAX_INTERVAL,r=Number(i.default.get("_hzt.interval"))||o.default.EVENTS_SENDER_INTERVAL;r<=n&&r>=t&&e.interval!==r&&e.reschedule(r)}},function(e,t,n){var r,i;/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
!function(o){if(void 0===(i="function"==typeof(r=o)?r.call(t,n,t,e):r)||(e.exports=i),e.exports=o(),!1){var a=window.Cookies,s=window.Cookies=o();s.noConflict=function(){return window.Cookies=a,s}}}(function(){function e(){for(var e=0,t={};e<arguments.length;e++){var n=arguments[e];for(var r in n)t[r]=n[r]}return t}return function t(n){function r(t,i,o){var a;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(o=e({path:"/"},r.defaults,o)).expires){var s=new Date;s.setMilliseconds(s.getMilliseconds()+864e5*o.expires),o.expires=s}o.expires=o.expires?o.expires.toUTCString():"";try{a=JSON.stringify(i),/^[\{\[]/.test(a)&&(i=a)}catch(e){}i=n.write?n.write(i,t):encodeURIComponent(String(i)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),t=(t=(t=encodeURIComponent(String(t))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var u="";for(var l in o)o[l]&&(u+="; "+l,!0!==o[l]&&(u+="="+o[l]));return document.cookie=t+"="+i+u}t||(a={});for(var c=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,f=0;f<c.length;f++){var v=c[f].split("="),p=v.slice(1).join("=");this.json||'"'!==p.charAt(0)||(p=p.slice(1,-1));try{var h=v[0].replace(d,decodeURIComponent);if(p=n.read?n.read(p,h):n(p,h)||p.replace(d,decodeURIComponent),this.json)try{p=JSON.parse(p)}catch(e){}if(t===h){a=p;break}t||(a[h]=p)}catch(e){}}return a}}return r.set=r,r.get=function(e){return r.call(r,e)},r.getJSON=function(){return r.apply({json:!0},[].slice.call(arguments))},r.defaults={},r.remove=function(t,n){r(t,"",e(n,{expires:-1}))},r.withConverter=t,r}(function(){})})},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=r(n(2)),a=r(n(1)),s=r(n(0)),u=r(n(23)),l={READY:"statusReady",STATE_NOT_READY:"statusNotReady",STATE_LOADING:"statusLoading",STATE_SCHEDULED:"statusScheduled",STATE_ERROR:"statusError"},c=function(){return o.default.getResource("schemas",{data:{}})},d=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.url=t,this.state=l.STATE_NOT_READY,this.callbacks={onReady:[],onError:[],onRetry:[],onLoad:[]}}return i(e,[{key:"get",value:function(e,t){var n=e+"-"+t;if(!this.isReady())throw new Error(""+a.default.COMPONENT_NOT_READY);var r=c().data[n];if(!r)throw new Error(a.default.UNSUPPORTED_TYPE+": "+n);return r}},{key:"isReady",value:function(){return this.state===l.STATE_READY}},{key:"retry",value:function(){var e=this;this.state=l.STATE_SCHEDULED,this.callbacks.onRetry.forEach(function(e){return e()}),setTimeout(function(){e.state=l.STATE_NOT_READY,e.load()},s.default.SCHEMA_LOAD_COLLECTION_RETRY_AFTER_MSECS)}},{key:"onLoad",value:function(e){this.callbacks.onLoad.push(e)}},{key:"onRetry",value:function(e){this.callbacks.onRetry.push(e)}},{key:"onReady",value:function(e){if(this.state===l.STATE_READY)return e(c().data);if(this.callbacks.onReady.length>s.default.HORIZON_CALLBACK_STACK_LIMIT)throw new Error(a.default.LIMIT_EXCEEDED+" Schemas callback stack.");return this.callbacks.onReady.push(e)}},{key:"onError",value:function(e){this.state===l.STATE_ERROR?e():this.callbacks.onError.push(e)}},{key:"execAsync",value:function(e,t){setTimeout(function(){return e(t)},1)}},{key:"load",value:function(){var e=this,t=c();this.state===l.STATE_NOT_READY&&(this.state=l.STATE_LOADING,this.callbacks.onLoad.forEach(function(e){return e()}),u.default.request("GET",this.url,function(n){t.data=Object.assign(t.data||{},n),e.state=l.STATE_READY,e.callbacks.onReady.forEach(function(n){return e.execAsync(n,t.data)})},function(t){e.state=l.STATE_ERROR,e.callbacks.onError.forEach(function(n){return e.execAsync(n,t)}),e.retry()}))}}]),e}();t.default={getInstance:function(e){var t=c();return t.provider||(t.provider=new d(e||s.default.HORIZON_SCHEMAS_HOST+"/schemas")),t.provider},getContextSchemas:c}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={request:function(e,t,n,r){var i=new XMLHttpRequest;i.open(e,t,!0),i.onload=function(){return i.status<400?n(JSON.parse(i.response)):r(i.response)},i.onerror=r,i.send()}}}])}()}("undefined"!=typeof self&&self)}]);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t){e.exports=__webpack_require__(0)},function(e,t,n){"use strict";function o(e,t,n){(0,i.render)((0,i.h)(l.default,{data:e,toolkit:n}),t)}Object.defineProperty(t,"__esModule",{value:!0}),t.name=void 0,t.render=o;var i=n(0);n(2);var r=n(3),l=function(e){return e&&e.__esModule?e:{default:e}}(r);t.name="post-agrupador-video"},function(e,t){},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e){return(0,v.h)("div",{style:g.style.header},e.children)}function u(e){return(0,v.h)("h2",{style:g.style.title},e.children)}function a(e){return(0,v.h)("ul",{style:g.style.items},e.children)}function s(e){var t=Object.assign({},g.style.item,0===e.index&&g.style.firstItem);return(0,v.h)("li",{style:t},e.children)}function p(e){return(0,v.h)("div",{style:g.style.chapeu},e.children)}function c(e){var t=e.chapeu,n=e.title,o=e.index,i=e.video;if(e.open||o<3)return(0,v.h)(s,{index:o},(0,v.h)("div",null,(0,v.h)(p,null,t),(0,v.h)(x,{video:i},n)),(0,v.h)(b,e))}function d(e){var t=e.url,n=e.open,o=e.onClick;if(e.condition)return(0,v.h)("div",{style:g.style.plus},(0,v.h)("a",{href:t,style:g.style.linkplus,className:"gui-color-primary",onClick:o},e.children,(0,v.h)("span",{className:"post-bastian-products__arrow"},(0,v.h)("svg",{viewBox:"2 2 18 18"},n?(0,v.h)("path",{d:"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"}):(0,v.h)("path",{d:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"})))))}Object.defineProperty(t,"__esModule",{value:!0});var f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},h=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),v=n(0),y=n(4),g=n(5),m=function(){return window.gui&&window.gui.lightbox&&"function"==typeof window.gui.lightbox.lightbox},b=function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.toolkit=n.props.toolkit,n.video=Object.assign({},n.props.video,{video:{id:n.props.video.identifier}}),n}return r(t,e),h(t,[{key:"shouldComponentUpdate",value:function(){return!1}},{key:"componentDidMount",value:function(){var e=this.toolkit.ui.Video(this.video);this.base.appendChild(e),(0,y.check)(m).then(function(){var t={};if(window.SETTINGS&&window.SETTINGS.BASTIAN){var n=window.SETTINGS.BASTIAN.VIDEO_SITEPAGE;!1!==n&&(n=!0),t.publicidadePagina=n}window.gui.lightbox.lightbox(e,t)})}},{key:"render",value:function(){return(0,v.h)("div",{style:g.style.video,className:"video-fd"})}}]),t}(v.Component),x=function(e){function t(e){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return r(t,e),h(t,[{key:"shouldComponentUpdate",value:function(){return!1}},{key:"componentDidMount",value:function(){var e=this;(0,y.check)(m).then(function(){window.gui.lightbox.lightbox(e.base,{})})}},{key:"render",value:function(){var e=this.props.video;return(0,v.h)("a",{href:e.url,style:g.style.link,className:"gui-color-primary","data-type":"video","data-link":e.url,"data-short-url":e.url,"data-video-id":e.identifier,"data-title":e.alt},this.props.children)}}]),t}(v.Component),w=function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e)),r=n.props.data.content;return n.state={open:r.posts.length<=3},n}return r(t,e),h(t,[{key:"onClick",value:function(e){this.state.open||(e.preventDefault(),this.setState({open:!0}))}},{key:"render",value:function(){var e=this,t=this.props.data.content,n=t.footer,o=this.state.open;return(0,v.h)("div",{className:"post-agrupador-video theme"},(0,v.h)(l,null,(0,v.h)(u,null,t.title)),(0,v.h)(a,null,t.posts.map(function(t,n){return(0,v.h)(c,f({index:n,open:o},t,e.props))})),(0,v.h)(d,{url:n?n.url:null,open:o,onClick:this.onClick.bind(this),condition:n&&n.url||t.posts.length>3&&!o},o?n?"Tudo sobre "+n.title:"":"Mais "+t.title))}}]),t}(v.Component);t.default=w},function(e,t,n){"use strict";function o(){for(var e in i){var t=i[e];!1===t.done&&t.assertion()&&(t.done=!0,r--,t.resolver())}r>0&&setTimeout(o,150)}Object.defineProperty(t,"__esModule",{value:!0});var i={},r=0;t.check=function(e){var t=e.toString();if(t in i)return i[t].promise;var n={resolver:null,assertion:null,promise:null,done:!1},l=new Promise(function(e){n.resolver=e});return n.promise=l,n.assertion=e,i[t]=n,r++,o(),l}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o='opensans, "opensans-bastian", Arial, sans-serif';t.style={content:{},header:{borderBottom:"solid 1px #eeeeee",padding:"1rem 1.5rem"},title:{fontFamily:o,fontSize:"1rem",fontWeight:"bold",letterSpacing:"-0.4px",color:"#333",lineHeight:"20px"},items:{padding:"0 1.5rem"},item:{borderTop:"1px solid #eee",padding:"1.5rem 0",position:"relative",display:"flex",justifyContent:"space-between",alignItems:"flex-start"},firstItem:{borderTop:"0"},chapeu:{fontSize:"15px",fontWeight:"600",letterSpacing:"-0.75px",lineHeight:"20px",color:"#333",marginBottom:"0.5rem",fontFamily:o},link:{fontSize:"1rem",lineHeight:"20px",letterSpacing:"-1px",fontFamily:o,fontWeight:700},video:{float:"right",margin:"0 0 0 1rem",width:"94px",minWidth:"94px",height:"94px",minHeight:"94px",display:"flex"},plus:{borderTop:"1px solid #eee",padding:"16px 24px"},linkplus:{fontFamily:o,fontSize:"14px",fontWeight:"700",lineHeight:"1.14",letterSpacing:"-.7px",cursor:"pointer"}}}]);

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t){e.exports=__webpack_require__(0)},function(e,t,n){"use strict";function r(e,t,n){(0,i.render)((0,i.h)(a.default,{data:e,toolkit:n}),t)}Object.defineProperty(t,"__esModule",{value:!0}),t.name=void 0,t.render=r,n(2);var i=n(0),o=n(3),a=function(e){return e&&e.__esModule?e:{default:e}}(o);t.name="post-agrupador-materia"},function(e,t){},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e,t,n){return e?t:n}function s(e){return(0,v.h)("div",{style:O.header},e.children)}function l(e){return(0,v.h)("h2",{style:O.title},e.children)}function u(e){return(0,v.h)("ul",{style:O.items},e.children)}function c(e){var t=Object.assign({},O.item,0===e.index&&O.firstItem);return(0,v.h)("li",{style:t},e.children)}function p(e){return(0,v.h)("div",{style:O.content,className:e.className},e.children)}function f(e){if(e.children.filter(function(e){return e}).length)return(0,v.h)("div",{style:O.chapeu},e.children)}function d(e){var t=e.species,n=e.image;if(n&&n.sizes&&n.sizes.postP){var r=Object.assign({},O.image,O["image"+t]);return(0,v.h)("img",{src:n.sizes.postP.url,style:r,width:n.sizes.postP.width,height:n.sizes.postP.height,alt:"Foto: ("+n.name+" / "+n.rightsHolder+")"})}return null}function h(e){var t=e.url,n=e.children,r=e.style;return(0,v.h)("a",{href:t,className:"gui-color-primary",style:Object.assign({},O.link,r),onClick:e.onClick},n)}function m(e){var t=e.chapeu,n=e.title,r=e.index;if(e.open||r<3)return(0,v.h)(c,e,(0,v.h)("div",null,(0,v.h)(f,null,t),(0,v.h)(h,e,n)),(0,v.h)(h,e,(0,v.h)(d,e)))}function g(e){var t=e.children,n=e.open,r=e.url;if(e.condition)return(0,v.h)("div",{style:O.maisSobre},(0,v.h)(h,{url:r,onClick:e.onClick,style:O.maisSobreLink},t,(0,v.h)("span",{className:"post-bastian-products__arrow"},(0,v.h)("svg",{viewBox:"2 2 18 18"},a(n,(0,v.h)("path",{d:"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"}),(0,v.h)("path",{d:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"}))))))}Object.defineProperty(t,"__esModule",{value:!0}),t.STYLE=void 0;var y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},b=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();t.Header=s,t.Title=l,t.Items=u,t.Item=c,t.Content=p,t.Chapeu=f,t.Image=d,t.Link=h,t.PostBase=m;var v=n(0),x=n(4),k=function(e){return e&&e.__esModule?e:{default:e}}(x),_='opensans, "opensans-bastian", Arial, sans-serif',O=t.STYLE={content:{},header:{borderBottom:"solid 1px #eeeeee",padding:"1rem 1.5rem"},title:{fontFamily:_,fontSize:"1rem",fontWeight:"bold",letterSpacing:"-0.4px",color:"#333",lineHeight:"20px"},items:{padding:"0 1.5rem",transition:"height 2s"},item:{borderTop:"1px solid #eee",padding:"1.5rem 0",position:"relative",display:"flex",justifyContent:"space-between",alignItems:"flex-start"},firstItem:{borderTop:"0"},chapeu:{fontSize:"15px",fontWeight:"600",letterSpacing:"-0.75px",lineHeight:"20px",color:"#333",marginBottom:"0.5rem",fontFamily:_},link:{fontSize:"1rem",lineHeight:"20px",letterSpacing:"-1px",fontFamily:_,fontWeight:700},image:{float:"right",margin:"0 0 0 1rem"},imageBlog:{borderRadius:"50%"},imagePost:{borderRadius:"50%"},maisSobre:{borderTop:"1px solid #eee",padding:"16px 24px"},maisSobreLink:{fontFamily:_,fontSize:"14px",fontWeight:"700",lineHeight:"1.14",letterSpacing:"-.7px",cursor:"pointer"}},S=function(e){function t(e){r(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e)),o=e.data.content;return n.state={open:o.posts.length<=3},n}return o(t,e),b(t,[{key:"sendToAnalytics",value:function(e){var t=this.props.toolkit,n=t.isLargeScreen,r=t.getItemPosition,i=n?"right-collumn":"feed",o=r(),a=this.props.data.content.title;(0,k.default)("click | "+i+" | "+e+" | "+a+" | position "+o)}},{key:"onClick",value:function(e){this.state.open?this.sendToAnalytics("tudo sobre"):(e.preventDefault(),this.setState({open:!0}),this.sendToAnalytics("ver mais"))}},{key:"onItemClick",value:function(e){this.sendToAnalytics("post "+(e+1))}},{key:"render",value:function(){var e=this,t=this.props.data.content,n=this.state.open,r=t.footer,i=void 0===r?{}:r;return(0,v.h)(p,{className:"post-agrupador-materia theme"},(0,v.h)(s,null,(0,v.h)(l,null,t.title)),(0,v.h)(u,null,t.posts.map(function(r,i){return(0,v.h)(m,y({key:t.id+"-"+i,index:i,open:n,onClick:function(){e.onItemClick(i)}},r,e.props))})),(0,v.h)(g,{url:i.url,onClick:this.onClick.bind(this),open:n,condition:i.url||t.posts.length>3&&!n},n?"Tudo sobre":"Mais"," ",i.title||t.title))}}]),t}(v.Component);t.default=S},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){try{window.ga(l+"_portal.send","event",r,i,e)}catch(e){console.error(e)}};var r="feed",i="post agrupador matéria",o=window.cdaaas||{},a=o.SETTINGS,s=a||{},l=s.SITE_ID}]);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t){e.exports=__webpack_require__(0)},function(e,t,n){"use strict";function i(e,t,n){(0,r.render)((0,r.h)(a.default,{data:e,toolkit:n}),t)}Object.defineProperty(t,"__esModule",{value:!0}),t.name=void 0,t.render=i;var r=n(0);n(2);var o=n(3),a=function(e){return e&&e.__esModule?e:{default:e}}(o);t.name="post-agrupador-horizontal"},function(e,t){},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e,t,n){return e?t:n}function s(e){return(0,w.h)("div",{style:O.header},e.children)}function l(e){return(0,w.h)("h2",{style:O.title},e.children)}function u(e){return e.toolkit.isLargeScreen?(0,w.h)("div",{style:O.items},e.children):(0,w.h)("div",{style:O.itemsMobile},e.children)}function c(e){var t=void 0;return t=e.toolkit.isLargeScreen?Object.assign({},O.item,0===e.index&&O.firstItem):O.itemMobile,(0,w.h)("div",{style:t},e.children)}function f(e){return(0,w.h)("div",{style:O.content,className:e.className},e.children)}function d(e){if(e.children.filter(function(e){return e}).length)return(0,w.h)("div",{style:O.chapeu},e.children)}function p(e){var t=e.image,n=e.toolkit;if(t&&t.sizes&&t.sizes.Q){var i=O.imageMobile,r=t.sizes.XS||t.sizes.S,o=188,a=106;return n.isLargeScreen&&(i=O.image,r=t.sizes.Q,o=94,a=94),(0,w.h)("img",{src:r.url,style:i,width:o,height:a,alt:"Foto: ("+t.name+" / "+t.rightsHolder+")"})}return null}function h(e){var t=e.url,n=e.children,i=e.style,r=O.linkMobile;return this.props.toolkit&&this.props.toolkit.isLargeScreen&&(r=O.link),(0,w.h)("a",{href:t,className:"gui-color-primary",style:Object.assign({},r,i),onClick:e.onClick},n)}function m(e){var t=e.chapeu,n=e.title,i=e.index,r=e.open;return this.props.toolkit.isLargeScreen?r||i<3?(0,w.h)(c,e,(0,w.h)("div",null,(0,w.h)(d,null,t),(0,w.h)(h,e,n)),(0,w.h)(h,e,(0,w.h)(p,e))):void 0:("firefox"===S.name&&(n=n.match(/.{1,35}/g),n.length>1&&(n[0]=n[0].concat("...")),n=n[0]),(0,w.h)(c,e,(0,w.h)(p,e),(0,w.h)(h,e,n)))}function g(e){var t=e.children,n=e.open,i=e.url;if(e.condition)return(0,w.h)("div",{style:O.maisSobre},(0,w.h)(h,{url:i,onClick:e.onClick,style:O.maisSobreLink},t," ",n,(0,w.h)("span",{className:"post-bastian-products__arrow"},(0,w.h)("svg",{viewBox:"2 2 18 18"},a(n,(0,w.h)("path",{d:"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"}),(0,w.h)("path",{d:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"}))))))}Object.defineProperty(t,"__esModule",{value:!0}),t.STYLE=void 0;var v=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},b=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();t.Header=s,t.Title=l,t.Items=u,t.Item=c,t.Content=f,t.Chapeu=d,t.Image=p,t.Link=h,t.PostBase=m;var w=n(0),y=n(4),S=(0,y.detect)(),x='opensans, "opensans-bastian", Arial, sans-serif',O=t.STYLE={content:{},header:{borderBottom:"solid 1px #eeeeee",padding:"1rem 1.5rem"},title:{fontFamily:x,fontSize:"1rem",fontWeight:"bold",letterSpacing:"-0.4px",color:"#333",lineHeight:"20px"},itemsMobile:{padding:"0 1.5rem",overflowY:"scroll",display:"flex",alignItems:"flex-start"},itemMobile:{borderTop:"0",padding:"24px 8px 24px 0",width:"200px"},items:{padding:"0 1.5rem"},item:{borderTop:"1px solid rgb(238, 238, 238)",padding:"1.5rem 0",position:"relative",display:"flex",justifyContent:"space-between",alignItems:"flex-start"},firstItem:{borderTop:"0"},chapeu:{fontSize:"15px",fontWeight:"600",letterSpacing:"-0.75px",lineHeight:"20px",color:"#333",marginBottom:"0.5rem",fontFamily:x},linkMobile:{fontSize:"16px",lineHeight:1.25,letterSpacing:"-1px",fontFamily:x,fontWeight:700,display:"-webkit-box",webkitBoxOrient:"vertical",webkitLineClamp:3,textOverflow:"ellipsis",overflow:"hidden"},link:{fontSize:"16px",lineHeight:1.25,letterSpacing:"-1px",fontFamily:x,fontWeight:700},imageMobile:{marginBottom:10},image:{float:"right",margin:"0 0 0 1rem"},maisSobre:{borderTop:"1px solid #eee",padding:"16px 24px"},maisSobreLink:{fontFamily:x,fontSize:"14px",fontWeight:"700",lineHeight:"1.14",letterSpacing:"-.7px",cursor:"pointer"}},T=function(e){function t(e){i(this,t);var n=r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e)),o=e.toolkit,a=e.data,s=a.externalData;s=s||{};var l=s.items||[];return n.state={items:n.filterWithoutImage(l),open:l.length<=3||!o.isLargeScreen},n}return o(t,e),b(t,[{key:"filterWithoutImage",value:function(e){return e.filter(function(e){return e.content.image&&JSON.stringify(e.content.image)!==JSON.stringify({})})}},{key:"componentDidMount",value:function(){var e=this,t=this.props.data,n=t.externalData,i=void 0===n?{}:n,r=t.tenantId,o=i.config,a=void 0===o?{}:o,s=a.recommendation,l=void 0===s?{}:s,u=a.editorialSlice,c=void 0===u?0:u,f=this.state.items;if(l.active){var d=new URL(SETTINGS.BASTIAN.RECOMMENDATION_URL).hostname,p=l.contentId||"FEED",h="https://"+d+"/rec/v2/user/"+r+"/"+p+"?type=bastian&page=1&limit=10&photo_size=540x304/top/smart,810x456/top/smart,1080x608/top/smart";fetch(h,{method:"GET",credentials:"include"}).then(function(e){return e.json()}).then(function(t){e.setState({items:f.slice(0,c).concat(e.filterWithoutImage(t))})})}}},{key:"onClick",value:function(e){this.state.open||(e.preventDefault(),this.setState({open:!0}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.open,i=t.items,r=this.props.data.content,o=void 0===r?{}:r,a=o.footer,c=void 0===a?{}:a;return(0,w.h)(f,{className:"post-agrupador-horizontal theme"},(0,w.h)(s,null,(0,w.h)(l,null,o.title)),(0,w.h)(u,this.props,i.map(function(t,i){return(0,w.h)(m,v({key:t.content.id+"-"+i,index:i,open:n},t.content,e.props))})),(0,w.h)(g,{url:c.url,condition:c.url||i.length>3&&!n,open:n,onClick:this.onClick.bind(this)},n?"Tudo sobre":"Mais"," ",c.title||o.title))}}]),t}(w.Component);t.default=T},function(e,t,n){(function(t){function n(){return"undefined"!=typeof navigator?o(navigator.userAgent):r()}function i(e){var t=s(),n=t.filter(function(t){return t.rule&&t.rule.test(e)})[0];return n?n.name:null}function r(){return void 0!==t&&t.version&&{name:"node",version:t.version.slice(1),os:t.platform}}function o(e){var t=a();if(!e)return null;var n=t.map(function(t){var n=t.rule.exec(e),i=n&&n[1].split(/[._]/).slice(0,3);return i&&i.length<3&&(i=i.concat(1==i.length?[0,0]:[0])),n&&{name:t.name,version:i.join(".")}}).filter(Boolean)[0]||null;return n&&(n.os=i(e)),/alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/i.test(e)&&(n=n||{},n.bot=!0),n}function a(){return l([["aol",/AOLShield\/([0-9\._]+)/],["edge",/Edge\/([0-9\._]+)/],["yandexbrowser",/YaBrowser\/([0-9\._]+)/],["vivaldi",/Vivaldi\/([0-9\.]+)/],["kakaotalk",/KAKAOTALK\s([0-9\.]+)/],["samsung",/SamsungBrowser\/([0-9\.]+)/],["chrome",/(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],["phantomjs",/PhantomJS\/([0-9\.]+)(:?\s|$)/],["crios",/CriOS\/([0-9\.]+)(:?\s|$)/],["firefox",/Firefox\/([0-9\.]+)(?:\s|$)/],["fxios",/FxiOS\/([0-9\.]+)/],["opera",/Opera\/([0-9\.]+)(?:\s|$)/],["opera",/OPR\/([0-9\.]+)(:?\s|$)$/],["ie",/Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],["ie",/MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],["ie",/MSIE\s(7\.0)/],["bb10",/BB10;\sTouch.*Version\/([0-9\.]+)/],["android",/Android\s([0-9\.]+)/],["ios",/Version\/([0-9\._]+).*Mobile.*Safari.*/],["safari",/Version\/([0-9\._]+).*Safari/],["facebook",/FBAV\/([0-9\.]+)/],["instagram",/Instagram\s([0-9\.]+)/],["ios-webview",/AppleWebKit\/([0-9\.]+).*Mobile/]])}function s(){return l([["iOS",/iP(hone|od|ad)/],["Android OS",/Android/],["BlackBerry OS",/BlackBerry|BB10/],["Windows Mobile",/IEMobile/],["Amazon OS",/Kindle/],["Windows 3.11",/Win16/],["Windows 95",/(Windows 95)|(Win95)|(Windows_95)/],["Windows 98",/(Windows 98)|(Win98)/],["Windows 2000",/(Windows NT 5.0)|(Windows 2000)/],["Windows XP",/(Windows NT 5.1)|(Windows XP)/],["Windows Server 2003",/(Windows NT 5.2)/],["Windows Vista",/(Windows NT 6.0)/],["Windows 7",/(Windows NT 6.1)/],["Windows 8",/(Windows NT 6.2)/],["Windows 8.1",/(Windows NT 6.3)/],["Windows 10",/(Windows NT 10.0)/],["Windows ME",/Windows ME/],["Open BSD",/OpenBSD/],["Sun OS",/SunOS/],["Linux",/(Linux)|(X11)/],["Mac OS",/(Mac_PowerPC)|(Macintosh)/],["QNX",/QNX/],["BeOS",/BeOS/],["OS/2",/OS\/2/],["Search Bot",/(nuhk)|(Googlebot)|(Yammybot)|(Openbot)|(Slurp)|(MSNBot)|(Ask Jeeves\/Teoma)|(ia_archiver)/]])}function l(e){return e.map(function(e){return{name:e[0],rule:e[1]}})}e.exports={detect:n,detectOS:i,getNodeVersion:r,parseUserAgent:o}}).call(t,n(5))},function(e,t){function n(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function r(e){if(c===setTimeout)return setTimeout(e,0);if((c===n||!c)&&setTimeout)return c=setTimeout,setTimeout(e,0);try{return c(e,0)}catch(t){try{return c.call(null,e,0)}catch(t){return c.call(this,e,0)}}}function o(e){if(f===clearTimeout)return clearTimeout(e);if((f===i||!f)&&clearTimeout)return f=clearTimeout,clearTimeout(e);try{return f(e)}catch(t){try{return f.call(null,e)}catch(t){return f.call(this,e)}}}function a(){m&&p&&(m=!1,p.length?h=p.concat(h):g=-1,h.length&&s())}function s(){if(!m){var e=r(a);m=!0;for(var t=h.length;t;){for(p=h,h=[];++g<t;)p&&p[g].run();g=-1,t=h.length}p=null,m=!1,o(e)}}function l(e,t){this.fun=e,this.array=t}function u(){}var c,f,d=e.exports={};!function(){try{c="function"==typeof setTimeout?setTimeout:n}catch(e){c=n}try{f="function"==typeof clearTimeout?clearTimeout:i}catch(e){f=i}}();var p,h=[],m=!1,g=-1;d.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];h.push(new l(e,t)),1!==h.length||m||r(s)},l.prototype.run=function(){this.fun.apply(null,this.array)},d.title="browser",d.browser=!0,d.env={},d.argv=[],d.version="",d.versions={},d.on=u,d.addListener=u,d.once=u,d.off=u,d.removeListener=u,d.removeAllListeners=u,d.emit=u,d.prependListener=u,d.prependOnceListener=u,d.listeners=function(e){return[]},d.binding=function(e){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(e){throw new Error("process.chdir is not supported")},d.umask=function(){return 0}}]);

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports=function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t){e.exports=__webpack_require__(0)},function(e,t,n){"use strict";function r(e,t,n){(0,o.render)((0,o.h)(a.default,{name:c,data:e,toolkit:n}),t)}Object.defineProperty(t,"__esModule",{value:!0}),t.name=void 0,t.render=r;var o=n(0),i=n(2),a=function(e){return e&&e.__esModule?e:{default:e}}(i),c=t.name="post-editorias-e-assuntos"},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){return(0,h.h)("h2",{style:g.title},e.children)}function c(e){var t=g.items;return e.toolkit.isLargeScreen&&(t=Object.assign({},g.items,g.itemsDesktop)),(0,h.h)("div",{style:t},e.children)}function s(e){var t=e.title,n=e.image,r=void 0===n?{}:n,o=e.toolkit,i=r.sizes,a=void 0===i?{}:i,c=a.postSubject,s=void 0===c?{}:c,l=Object.assign({},g.item,{backgroundImage:"url("+s.url+")"},o.isLargeScreen?g.itemDesktop:{}),p={};return t&&(p={background:"rgba(0, 0, 0, 0.2)"}),(0,h.h)("div",{style:l,className:"teste"},(0,h.h)(u,d({},e,{style:p})," ",t," "))}function l(e){return(0,h.h)("section",{style:g.content,className:e.className},e.children)}function u(e){var t=e.url,n=e.children,r=e.style,o=void 0===r?{}:r,i=e.toolkit,a=Object.assign({},o,g.link,i.isLargeScreen?g.linkDesktop:{});return(0,h.h)("a",{href:t,className:"gui-color-primary",style:a,onClick:e.onClick},n)}function p(e){var t=e.children;return(0,h.h)("div",{style:g.description},t)}Object.defineProperty(t,"__esModule",{value:!0}),t.STYLES=void 0;var f=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};t.Title=a,t.Items=c,t.Item=s,t.Content=l,t.Link=u,t.Description=p;var h=n(0),m='opensans, "opensans-bastian", Arial, sans-serif',g=t.STYLES={content:{},title:{margin:"24px 24px 8px 24px",fontFamily:m,fontSize:15,fontWeight:600,letterSpacing:"-0.75px",color:"#333",lineHeight:1.25},description:{fontFamily:m,fontSize:16,letterSpacing:"-0.8px",color:"#555",lineHeight:1.25,margin:"0 24px 12px 24px"},items:{overflowY:"scroll",display:"flex",alignItems:"center",margin:"24px 0 12px 24px"},itemsDesktop:{flexWrap:"wrap",margin:"24px 12px 12px 24px"},item:{margin:"0 12px 12px 0",backgroundColor:"#4d4d4d",backgroundRepeat:"no-repeat",backgroundPosition:"center center",backgroundSize:"142px 120px"},itemDesktop:{width:"calc(50% - 12px)",backgroundSize:"cover"},linkDesktop:{width:"100%"},link:{display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",lineHeight:"20px",letterSpacing:"-1px",fontFamily:m,width:142,height:120,fontWeight:700,color:"#fff"}},y=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),f(t,[{key:"render",value:function(){var e=this,t=this.props,n=t.data,r=t.name,o=n.content;return(0,h.h)(l,{className:r+" theme"},(0,h.h)(a,null,o.title),(0,h.h)(p,null,o.description),(0,h.h)(c,this.props,o.posts.map(function(t,n){return(0,h.h)(s,d({key:o.id+"-"+n,index:n},t,e.props))})))}}]),t}(h.Component);t.default=y}]);

/***/ })
/******/ ]);