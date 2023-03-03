import { FC } from 'react';

interface SearchIconProps {
  color: string;
}

const SearchIcon: FC<SearchIconProps> = ({ color }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8ZM8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C9.84871 16 11.551 15.3729 12.9056 14.3199L18.2929 19.7071C18.6834 20.0976 19.3166 20.0976 19.7071 19.7071C20.0976 19.3166 20.0976 18.6834 19.7071 18.2929L14.3199 12.9056C15.3729 11.551 16 9.84871 16 8C16 3.58172 12.4183 0 8 0Z"
        fill="white"
      />
    </svg>
  );
};

export default SearchIcon;
