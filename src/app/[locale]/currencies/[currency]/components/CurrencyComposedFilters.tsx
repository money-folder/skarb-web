'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import { getLocalISOString } from '@/utils';
import { isValidDate } from '@/utils/time-utils';

const CurrencyComposedFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { register, watch } = useForm();

  const dateFromParam = searchParams.get('dateFrom')
    ? getLocalISOString(new Date(+searchParams.get('dateFrom')!))
    : undefined;

  const dateToParam = searchParams.get('dateTo')
    ? getLocalISOString(new Date(+searchParams.get('dateTo')!))
    : undefined;

  useEffect(() => {
    watch((data) => {
      const params = new URLSearchParams(searchParams);
      if (data.dateFrom && isValidDate(data.dateFrom)) {
        params.set('dateFrom', data.dateFrom.getTime());
      } else {
        params.delete('dateFrom');
      }

      if (data.dateTo && isValidDate(data.dateTo)) {
        params.set('dateTo', data.dateTo.getTime());
      } else {
        params.delete('dateTo');
      }

      replace(`${pathname}?${params.toString()}`);
    });
  }, [watch, searchParams, replace, pathname]);

  return (
    <form>
      <div className="flex gap-5">
        <label className="flex gap-3">
          <span>From</span>
          <input
            {...register('dateFrom', {
              required: false,
              valueAsDate: true,
            })}
            type="datetime-local"
            name="dateFrom"
            {...(dateFromParam ? { defaultValue: dateFromParam } : {})}
          />
        </label>
        <label className="flex gap-3">
          <span>To</span>
          <input
            {...register('dateTo', { required: false, valueAsDate: true })}
            type="datetime-local"
            name="dateTo"
            {...(dateToParam ? { defaultValue: dateToParam } : {})}
          />
        </label>
      </div>
    </form>
  );
};

export default CurrencyComposedFilters;
