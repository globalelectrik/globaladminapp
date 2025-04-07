import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'


export default function BrandsComboBox({brandsData, brandSelected, setBrandSelected}) {
  const [query, setQuery] = useState('')

  return (
    <Combobox
      as="div"
      value={brandSelected}
      onChange={setBrandSelected}

    >
      <div className="relative mt-2">
        <ComboboxInput
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-800 sm:text-sm sm:leading-6 placeholder-slate-300"
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery('')}
          placeholder='Omron'
          displayValue={(brand) => brand?.brandName}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>

        {brandsData?.brands?.length > 0 && (
          <ComboboxOptions className="absolute z-50 bottom-full mb-1 max-h-20 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">

            {brandsData?.brands?.map((brand) => (
              <ComboboxOption
                key={brand.id}
                value={brand}
                className="group relative cursor-default select-none py-1 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-800 data-[focus]:text-white"
              >
                <span className="block truncate group-data-[selected]:font-semibold text-xs">{brand.brandName}</span>
                <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-800 group-data-[selected]:flex group-data-[focus]:text-white">
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                </span>

              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  )
}