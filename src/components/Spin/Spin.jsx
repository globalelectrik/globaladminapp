export default function Spin({ children }) {
	return (
		<>
			<div className='m-4 flex items-center justify-center rounded-md px-4 py-2 '>
				<svg
					className='-ml-1 mr-3 h-12 w-12 animate-spin text-indigo-600'
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'>
					<circle
						className='opacity-25'
						cx='12'
						cy='12'
						r='10'
						stroke='currentColor'
						srokewidth='4'></circle>
					<path
						className='opacity-75'
						fill='currentColor'
						d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
				</svg>
			</div>
			<p className='text-center font-bold text-indigo-600 select-none'>{children}</p>
		</>
	);
}
