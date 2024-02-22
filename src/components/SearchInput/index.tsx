import React from 'react';
import type { InputProps, InputRef } from 'antd';
import { Input } from 'antd';
import Icon from '../Icon';

type SearchInputProps = {
  onSearch?: (value: string) => void;
} & Omit<InputProps, 'suffix'>;

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const { onSearch, ...restProps } = props;
  const inputRef = React.useRef<InputRef>(null);

  const search = () => onSearch && onSearch(inputRef.current?.input?.value ?? '');

  return (
    <Input
      ref={inputRef}
      onPressEnter={search}
      {...restProps}
      suffix={<Icon type="icon-sousuo" onClick={search} />}
    />
  );
};

export default React.memo(SearchInput);
