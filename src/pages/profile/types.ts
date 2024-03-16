import { Client, GetAuthenticatedClientQuery, ListCitiesQuery, ListCountriesQuery } from '../../API';

export interface UpdateAccountInformationFromApi {
  data: { editProfile: Client };
}

export interface ListCountriesFromApi {
  data: ListCountriesQuery;
}

export interface ListCitiesFromApi {
  data: ListCitiesQuery;
}

export interface GetClientFromApi {
  data: GetAuthenticatedClientQuery;
}
