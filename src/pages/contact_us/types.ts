import { ListFAQsQuery, ContactUsMutation } from '../../API';

export interface ListFAQsFromApi {
  data: ListFAQsQuery;
}

export interface ContactUsInputsApi {
  data: ContactUsMutation;
}

export interface ResponseType {
  message: string;
  status: string;
}
