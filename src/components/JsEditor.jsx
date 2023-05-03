import React, {useEffect, useState} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/worker-javascript";
import PropTypes from "prop-types";

function JsEditor(props) {
    console.log(props.jsScript)
    const [code, setCode] = useState(props.jsScript);
    const [editorKey, setEditorKey] = useState(Date.now().toString());
    useEffect(() => {
        setCode(props.jsScript)
        // js更新时，设置新的key，强制刷新aceEditor,
        // 否则会造成js代码更新不及时
        setEditorKey(Date.now().toString())
    },[props.jsScript])

    const handleCodeChange = (value) => {
        setCode(value);
        props.onChange && props.onChange(value)
    };

    const handleBlur= () => {
        props.onBlur && props.onBlur(code)
    };

    return (
        <AceEditor
            key={editorKey}
            mode="javascript"
            theme="chrome"
            onChange={handleCodeChange}
            onBlur={handleBlur}
            name="js-editor"
            editorProps={{ $blockScrolling: true }}
            value={code}
            height="200px"
            width="100%"
            setOptions={{
                useWorker:false,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true
            }}
        />
    );
}
JsEditor.propTypes = {
    onChange: PropTypes.func
};
export default JsEditor
