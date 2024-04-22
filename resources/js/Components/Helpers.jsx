import React from "react";
import {Link} from "@inertiajs/react";

export const _inArray = (needle, haystack) => {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] === needle) return true;
    }
    return false;
}

export const _navItem = (data, index, active_page=[]) => {

    const nodeDD = React.useRef(null);
    const [ expanded, setExpanded ] = React.useState(_inArray(data.name, active_page) ? true : false)
    const [ hoverState, setHoverState ] = React.useState(false)
    const [ buttonWidth, setButtonWidth ] = React.useState(0)
    const [ buttonHeight, setButtonHeight ] = React.useState(0)

    const handleClick = async(e) => {
        if (nodeDD.current.contains(e.target)) {
            return;
        }
        if(expanded){
            await _timeout(100)
            setExpanded(false);
        }
    };

    React.useLayoutEffect(() => {
        setButtonWidth(nodeDD.current.offsetWidth);
        setButtonHeight(nodeDD.current.offsetHeight);
    }, []);

    return(
        <li
            key={index}
            className={`${_inArray(data.name, active_page) ? 'active' : null} ${data.type ? 'li-'+data.type : null}`}
            ref={nodeDD}
            onMouseEnter={() => setHoverState(true)}
            onMouseLeave={() => setHoverState(false)}
        >
            {data.nested ?
                <>
                    <button type="button" onClick={()=>setExpanded(!expanded)} className="aItem">
                        {data.icon ? <span className={data.icon}></span> : null}
                        <span>{data.name}</span>
                    </button>
                    {data.badge ?  <div dangerouslySetInnerHTML={{ __html:data.badge}} /> : null}
                    <button type="button" onClick={()=>setExpanded(!expanded)}><span className={expanded ? 'icon-up' : 'icon-down'}/></button>
                    <ul className={` transition-transform ${expanded ? 'expanded' : ''}`}>
                        {data.nested.map((item,i)=>{
                            return _navItem(item,i, active_page)
                        })}
                    </ul>
                </>
                :
                <>
                    <Link href={data.url ? data.url : '#'}>
                        {data.icon ? <span className={data.icon}></span> : null}
                        <span>{data.name}</span>
                    </Link>
                    {data.badge ?  <div dangerouslySetInnerHTML={{ __html:data.badge}} /> : null}
                </>
            }
        </li>
    )

}
