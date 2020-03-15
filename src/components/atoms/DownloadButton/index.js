import React from 'react'

import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const DownloadButton = (props) => {
    return (
        <Button onClick={props.onClick}>
            <DownloadOutlined /> { props.value }
        </Button>
    )
}

export default DownloadButton;