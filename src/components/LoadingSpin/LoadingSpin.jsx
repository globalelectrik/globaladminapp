import { Fragment, useState } from 'react';
import { Dialog, FocusTrap, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import Spin from '../Spin/Spin';

export default function LoadingSpin() {
	const [open, setOpen] = useState(true);

	return (
		<Transition.Root show={open} as={Fragment} data-debug='Dialog'>
			<Dialog as='div' className='relative z-50 cursor-not-allowed' onClose={() => {}}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
				</Transition.Child>
				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex min-h-full justify-center p-4 text-center items-center '>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
							<Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
								<Spin>Cargando...</Spin>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
