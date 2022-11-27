import { FC, Fragment } from 'react';

import { useTranslation } from 'react-i18next';

import { Row, Col, Label } from 'reactstrap';

import camelCase from 'lodash/camelCase';
import capitalize from 'lodash/capitalize';

import Avatar from 'components/common/Avatar';
import HelmetWithTemplate from 'components/common/HelmetWithTemplate';
import withErrorBoundary from 'components/common/sentry/withErrorBoundary';
import EmptyPage from 'components/common/EmptyPage';
import Loading from 'components/common/Loading';

import useAnimalForSale from 'hooks/animals/sale/useAnimalForSale';
import useAnimalAge from 'hooks/animals/useAnimalAge';
import useEditorState from 'hooks/useEditorState';

import app from 'helpers/app';
import { COUNTRIES } from 'helpers/constants';

import { AlpacaPhenotype, SaleFragmentFragment, User } from 'generated/graphql';

const { appName } = app;

const getFullCountry = (code: string): string =>
  COUNTRIES.find(country => country.value === code)?.label || code;

const AlpacaForSale: FC = () => {
  const { t } = useTranslation();
  const { animalForSale, loading } = useAnimalForSale();

  const {
    name,
    sex,
    owner: { firstName, lastName, country, breederProfile } = {} as User,
    images = [],
    coloration,
    birthday,
    profile,
  } = animalForSale || ({} as SaleFragmentFragment);

  const { bio, email, phone } = breederProfile || {};
  const { phenotype = AlpacaPhenotype.Huacaya } = profile || {};

  const birthdayString = useAnimalAge(birthday);

  const { getCurrentEditorState } = useEditorState();

  const bioText = getCurrentEditorState(bio).getCurrentContent().getPlainText('\u0001');

  const avatarImages = images.map(image => ({
    src: image.url,
    placeholderSrc: image.thumbUrl || image.url,
  }));

  if (!animalForSale) {
    if (loading) return <Loading page />;

    return (
      <EmptyPage
        description={`${t(`animals.${app.appName}`)} ${t('common.notFound', {
          context: 'female',
        }).toLocaleLowerCase()} 😢`}
        title={t('common.notFound', {
          context: 'female',
        })}
      />
    );
  }

  return (
    <Fragment>
      <HelmetWithTemplate title='Alpaca for sale' />

      <div className='page sale-page-profile'>
        <div className='header'>
          <h1 className='heading'>{t('herds.animalsForSale', { context: appName })}</h1>
        </div>

        <div className='page-body'>
          <div className='content'>
            <div className='animal-info'>
              <Avatar name={name} images={avatarImages} />

              <div className='description'>
                <div className='animal-name'>
                  <h3>{name}</h3>
                </div>

                <div className='details'>
                  <Row>
                    <Col xs={6}>
                      <Label>
                        <h6>{t('animals.age.age')}</h6>
                        <p>{birthdayString}</p>
                      </Label>
                    </Col>

                    <Col xs={3}>
                      <Label>
                        <h6>{t('animals.sex')}</h6>
                        <p>{t(`animals.sexOptions.${camelCase(sex ?? 'unknown')}`)}</p>
                      </Label>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={3}>
                      <Label>
                        <h6>{t('profile.country')}</h6>
                        <p>{t(`countries.${camelCase(getFullCountry(country || ''))}`)}</p>
                      </Label>
                    </Col>

                    <Col xs={3}>
                      <Label>
                        <h6>{t('animals.type')}</h6>
                        <p>{capitalize(phenotype || '')}</p>
                      </Label>
                    </Col>

                    <Col xs={3}>
                      <Label>
                        <h6>{t('animals.coloration')}</h6>
                        <p>
                          {coloration?.map((color, index, array) => {
                            return `${t(`animals.colors.${color}`)}${
                              array?.length > ++index ? ', ' : ''
                            } `;
                          })}
                        </p>
                      </Label>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>

            <div className='breeder-info'>
              <h3 className='breeder-info-heading'>{t('profile.breeder')}</h3>

              <div className='description'>
                <Row>
                  <Col xs={6} md={5}>
                    <Label>
                      <h6>{t('common.name')}</h6>
                      <p className='name'>{`${firstName} ${lastName}`}</p>
                    </Label>
                  </Col>

                  <Col xs={5} md={3}>
                    <Label>
                      <h6>{t('profile.contactEmail')}</h6>
                      <p>{email}</p>
                    </Label>
                  </Col>

                  <Col xs={12} md={3}>
                    <Label>
                      <h6>{t('profile.contactPhone')}</h6>
                      <p>{phone}</p>
                    </Label>
                  </Col>

                  <Col md={12}>
                    <Label>
                      <h6>{t('profile.breederBio')}</h6>
                      <span>{bioText}</span>
                    </Label>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default withErrorBoundary(AlpacaForSale);
