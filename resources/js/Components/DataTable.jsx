import React from "react";
import DataTable from "react-data-table-component";
import axios from "axios";

const DataTableComponent = (props) => {
  const isInit = React.useRef(false);
  const [pending, setPending] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setRows(responseData);
      setPending(false);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const [defaultOptions, setDefaultOptions] = React.useState({
    totalRows: 0,
  });
  const [requestData, setRequestData] = React.useState({
    per_page: 10,
    page: 1,
    sort_directions: "asc",
    sort_by: null,
    search: props.search,
  });
  const [responseData, setResponseData] = React.useState([]);

  const _handlePageChange = (page) => {
    setRequestData({ ...requestData, page: page });
    // _fetch({...requestData, currentPage: page})
  };

  const _handlePerRowsChange = (newPerPage, page) => {
    setRequestData({ ...requestData, per_page: newPerPage, page: page });
  };

  const _handleSort = async (column, sortDirection) => {
    setRequestData({
      ...requestData,
      sort_by: column.sortField,
      sort_directions: requestData.sort_directions === "asc" ? "desc" : "asc",
    });
  };

  // React.useEffect(() => {
  //   const _fetch = (data, options = {}) => {
  //     if (props.path) {
  //       axios
  //         .get(props.path, { params: requestData })
  //         .then((res) => {
  //           setResponseData(res.data[props.object].data);
  //           setDefaultOptions({ totalRows: res.data[props.object].total });
  //         })
  //         .catch((err) => {
  //           console.log("error", err);
  //         });
  //     }

  //     if (props.data) {
  //       setResponseData(props.data);
  //     }
  //   };

  //   _fetch();
  // }, [requestData]);

  React.useEffect(() => {
    const _fetch = () => {
      if (props.path) {
        axios
          .get(props.path, { params: requestData })
          .then((res) => {
            setResponseData(res.data[props.object].data);
            setDefaultOptions({ totalRows: res.data[props.object].total });
          })
          .catch((err) => {
            console.log("error", err);
          });
      }

      if (props.data) {
        setResponseData(props.data);
      }
    };

    _fetch();
  }, [requestData, props.path, props.data, props.object]);

  React.useEffect(() => {
    if (isInit.current === true) {
      setRequestData({ ...requestData, search: props.search });
    } else {
      isInit.current = true;
    }
  }, [props?.search]);

  return (
    <div className="tableWrapper overflow-auto relative max-w-full">
      <DataTable
        columns={props.columns}
        progressPending={pending}
        data={responseData}
        highlightOnHover
        responsive
        pagination={props.pagination}
        paginationServer
        paginationTotalRows={defaultOptions.totalRows}
        paginationRowsPerPageOptions={[10, 25, 50]}
        paginationPerPage={requestData.perPage}
        paginationDefaultPage={requestData.currentPage}
        onChangeRowsPerPage={_handlePerRowsChange}
        onChangePage={(page) => _handlePageChange(page, props.options)}
        sortServer={props.path ? true : false}
        onSort={_handleSort}
        expandableRows={props.expandableRows}
        expandableRowsComponent={props.expandableRowsComponent}
      />
    </div>
  );
};

export default DataTableComponent;
