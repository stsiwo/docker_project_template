import * as React from 'react'
import { UseRequestStatusInputType, UseRequestStatusOutputType, RequestStatusType, FetchDataArgType } from "./types";
import { ResponseResultStatusEnum, ResponseResultType, QueryStringType, RequestMethodEnum } from '../../../requests/types';
import { buildQueryString } from '../../../utils';
import { request } from '../../../requests/request';
import { AxiosError } from 'axios';


export const useRequest = (input: UseRequestStatusInputType): UseRequestStatusOutputType => {

  const [currentRequestStatus, setRequestStatus] = React.useState<RequestStatusType>({
    status: ResponseResultStatusEnum.INITIAL
  })

  async function fetchData(args: FetchDataArgType) {
    setRequestStatus({
      status: ResponseResultStatusEnum.FETCHING,
    })
    await request({
      url: args.path + buildQueryString(args.queryString),
      ...(args.method && { method: args.method }),
      ...(args.headers && { headers: args.headers }),
      ...(args.data && { data: args.data })
    })
      .then((responseResult: ResponseResultType) => {
        /** this include 'catch' clause of 'requests' method **/
        setRequestStatus({
          status: responseResult.status,
          data: responseResult.data,
          errorMsg: responseResult.errorMsg
        })
        /**
         * any callback when response is secceeded 
         * e.g., assign domain data
         * e.g., assign new total count of pagination
         **/
        args.callback(responseResult.data)
      })
      .catch((error: AxiosError) => {
        /** this is called when above 'then' caluse failed **/
        /** esp, 'args.callback' internal error **/
        setRequestStatus({
          status: ResponseResultStatusEnum.FAILURE,
          errorMsg: error.message
        })
      })
  }

  return {
    currentRequestStatus: currentRequestStatus,
    setRequestStatus: setRequestStatus,
    fetchData: fetchData
  }
}



