import { useState } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ClientsComboBox({ clients, clientSelected, setClientSelected }) {
  const [query, setQuery] = useState('');

  // Filter clients based on the search query
  const filteredClients = query === '' 
    ? clients || []
    : (clients || []).filter((client) =>
        client.commercialClientName
          .toLowerCase()
          .includes(query.toLowerCase())
      );


  return (
    <Combobox as='div' value={clientSelected} onChange={setClientSelected}>
			<div className='relative mt-2'>
				<ComboboxInput
					className='w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-800 sm:text-sm sm:leading-6 placeholder-slate-300'
					onChange={(event) => setQuery(event.target.value)}
					displayValue={(client) => client?.commercialClientName || ''}
          placeholder='Busca un cliente...'
				/>
				<ComboboxButton className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
					<ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
				</ComboboxButton>

        {(filteredClients?.length > 0 || query !== '') && (
          <ComboboxOptions className='absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
            {filteredClients.length === 0 && query !== '' ? (
              <div className='py-2 pl-3 pr-5 text-gray-500'>
                No se encontraron clientes que coincidan con "{query}"
              </div>
            ) : (
              filteredClients.map((client) => (
                <ComboboxOption
                  key={client.id}
                  value={client}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-default select-none py-2 pl-3 pr-5',
                      active ? 'bg-indigo-800 text-white' : 'text-gray-900'
                    )
                  }>
                  {({ active, selected }) => (
                    <>
                      <span className={classNames('block truncate', selected && 'font-semibold')}>
                        {client.commercialClientName}
                      </span>

                      {selected && (
                        <span
                          className={classNames(
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                            active ? 'text-white' : 'text-indigo-800'
                          )}>
                          <CheckIcon className='h-5 w-5' aria-hidden='true' />
                        </span>
                      )}
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}
