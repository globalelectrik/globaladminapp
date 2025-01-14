import TitleHeader from '../../components/TitleHeader/TitleHeader';

export default function Main() {
	return (
		<div>
			<TitleHeader>
				<div className='min-w-0 flex-1'>
					<h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
						Main
					</h2>
				</div>
			</TitleHeader>
		</div>
	);
}
