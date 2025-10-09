

function CircleArrowRight(props) {
return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
    >
    <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
    >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 12h8m-4 4l4-4l-4-4"></path>
    </g>
    </svg>
)
}

export default CircleArrowRight;