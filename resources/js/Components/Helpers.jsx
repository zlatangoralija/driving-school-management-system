import React from "react";
import {Link} from "@inertiajs/react";
import moment from "moment-timezone";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

const tz = moment.tz.guess();
let user_tz = null
const metas = document.getElementsByTagName("META")
for (let i = 0; i < metas.length; i++) {
    const meta = metas[i];
    if(meta.name==='user-timezone'){
        user_tz = meta.content
    }
}

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(user_tz ? user_tz : tz);

export const _inArray = (needle, haystack) => {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] === needle) return true;
    }
    return false;
}

export const _timeout = function(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}

export const _metaCSRFtoken = () => {

    let token = null
    const metas = document.getElementsByTagName("META")
    for (let i = 0; i < metas.length; i++) {
        const meta = metas[i];
        if(meta.name==='csrf-token'){
            token = meta.content
        }
    }

    return token
}

export const _fetch = async(url, props={}, reponseType='json') => {
    const _props = {
        method:'POST',
        headers:{},
        ...props
    }
    //
    const header = () => {
        if(url=== route('upload-file') && _props.method==='POST'){
            return {
                'X-CSRF-TOKEN': _metaCSRFtoken(),
                ..._props.headers
            }
        }

        return {
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': _metaCSRFtoken(),
            ..._props.headers
        }
    }

    const defaultProps = {
        ..._props,
        headers: header()
    }

    const response = await fetch(url, defaultProps);
    let result

    if(reponseType==='json'){
        result = await response.json();
    }
    if(reponseType==='blob'){
        result = await response.blob();
    }

    if(response.status !== 200){
        return {error:true, ...result}
    }

    return result
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

export const timezoneDate = function(date) {
    return dayjs.utc(date).tz(user_timezone ? user_timezone : tz)
}

export const userTimezone = function() {
    let user_timezone = null
    const metas = document.getElementsByTagName("META")
    for (let i = 0; i < metas.length; i++) {
        const meta = metas[i];
        if(meta.name==='user-timezone'){
            user_timezone = meta.content
        }
    }

    return user_timezone;
}
