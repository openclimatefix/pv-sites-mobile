import { FC } from 'react';

interface SearchIconProps {
  color: string;
}

const SearchIcon: FC<SearchIconProps> = ({ color }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 10C4.5 6.68629 7.18629 4 10.5 4C13.8137 4 16.5 6.68629 16.5 10C16.5 13.3137 13.8137 16 10.5 16C7.18629 16 4.5 13.3137 4.5 10ZM10.5 2C6.08172 2 2.5 5.58172 2.5 10C2.5 14.4183 6.08172 18 10.5 18C12.3487 18 14.051 17.3729 15.4056 16.3199L20.7929 21.7071C21.1834 22.0976 21.8166 22.0976 22.2071 21.7071C22.5976 21.3166 22.5976 20.6834 22.2071 20.2929L16.8199 14.9056C17.8729 13.551 18.5 11.8487 18.5 10C18.5 5.58172 14.9183 2 10.5 2Z"
        fill={'currentColor'}
      />
    </svg>
  );
};

export default SearchIcon;
