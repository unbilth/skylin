import React from 'react'

import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadButton = (props) => {
    return (
        <Button onClick={props.onClick}>
            <UploadOutlined /> { props.value }
        </Button>
    )
}

export default UploadButton;