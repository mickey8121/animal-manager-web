import { FC, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import camelCase from 'lodash/camelCase';
import classnames from 'classnames';

import Avatar from 'components/common/Avatar';

import useAnimalAge from 'hooks/animals/useAnimalAge';
import useDataFromProvider from 'hooks/useDataFromProvider';
import useAnimalFromProvider from 'hooks/animals/animal/useAnimalFromProvider';
import useFormat from 'hooks/useFormat';

import { AnimalStatus } from 'generated/graphql';

const AnimalProfileInfo: FC = () => {
  const { data } = useDataFromProvider();
  const { animal } = useAnimalFromProvider();
  const { formatDate } = useFormat();
  const { t } = useTranslation();

  const animalAge = useAnimalAge(
    animal?.birthday,
    (animal?.status === AnimalStatus.Deceased || animal?.status === AnimalStatus.Other) &&
      animal?.deathDate,
  );

  const moreMedicationsQuantity = useMemo(
    () => (data?.medicationReminders?.length ?? 0) - 2,
    [data],
  );

  const reminders = useMemo(() => {
    if (!data?.medicationReminders) return [];

    return [...data.medicationReminders].sort(
      (a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime(),
    );
  }, [data]);

  const images = animal?.images.map(image => ({
    src: image.url,
    placeholderSrc: image.thumbUrl || image.url || image.originalUrl,
  }));

  if (!animal) return null;

  return (
    <div className='animal-profile'>
      <div className='animal-details'>
        <div className='animal-container'>
          <Avatar name={animal.name} images={images} className='animal-avatar' uploadable />
          <ul className='animal-details-list'>
            <li className='animal-details-list-item'>
              <span className='animal-info-span'>{`${t('animals.age.age')}:`}</span>
              <p className='animal-info-text'>{animalAge}</p>
            </li>
            {animal.status && (
              <li className='animal-details-list-item'>
                <span className='animal-info-span'>{`${t('animals.status')}:`}</span>
                <p className='animal-info-text'>
                  <span
                    className={classnames('animal-info-status', {
                      active: animal.status === AnimalStatus.Active,
                    })}
                  />
                  {t(`animals.statusOptions.${camelCase(animal.status)}`, {
                    context: camelCase(animal?.sex ?? ''),
                  })}
                </p>
              </li>
            )}
            {!!reminders.length && (
              <li className='animal-details-list-item reminders'>
                <span className='animal-info-span'>
                  {`${t('animals.medication.medicationDue')}:`}
                </span>
                <ul className='animal-reminders'>
                  {reminders
                    ?.map(remind => (
                      <li key={remind.id} className='animal-reminder'>
                        {`${remind.medication.type.name} - ${remind.dose}${t(
                          'animals.medication.ml',
                        )}, ${formatDate(new Date(remind.date), 'd MMM, yyyy')}`}
                      </li>
                    ))
                    .slice(0, 2)}
                  {moreMedicationsQuantity > 0 && (
                    <li className='animal-reminder animal-info-span'>
                      {`${t('animals.medication.moreRemind', {
                        item: moreMedicationsQuantity,
                      })} ...`}
                    </li>
                  )}
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnimalProfileInfo;
