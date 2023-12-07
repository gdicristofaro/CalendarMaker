import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';

export default function SmallSelect<Value>(props: { children?: any[], id: string, title: string, minWidth?: number } & SelectProps<Value>) {
    let { children, id, title, minWidth, ...others } = props;
  return (
    <FormControl sx={{ m: 1, minWidth: minWidth || 230 }} size="small">
      <InputLabel id={id + "_select_label"}>{title}</InputLabel>
      <Select
        labelId={id + "_select_label"}
        id={id + "_select"}
        title={title}
        {...others}
      >
        {children}
      </Select>
    </FormControl>
  );
}