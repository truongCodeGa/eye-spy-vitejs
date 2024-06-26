import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { BasicModal, ModalAccounts } from "../../modal";
import { headCells } from "../../utils/data";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useDispatch, useSelector } from "react-redux";
import {
  delAccount,
  deleteAccount,
  fetchDeleteAccounts,
  setDataAccount,
} from "../../../redux/accountSlice";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Skeleton, Stack } from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { Cards } from "../../card";
import useSliceString from "../../hook/useSliceString";
import { SearchData } from "../../search";
import useSearch from "../../hook/useSearch";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? "right" : "left"}
            align="left"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { newSlice } = useSliceString();
  const {
    selectIds,
    numSelected,
    dispatch,
    setSelected,
    setPage,
    // fetchListData,
    // handlePageDelete,
  } = props;
  const handleDeleteAll = () => {
    Swal.fire({
      title: `Xóa ${numSelected > 1 ? numSelected : ""} tài khoản?`,
      text: `Bạn sẽ không thể khôi phục ${
        numSelected == 1 ? "" : numSelected
      } tài khoản có id: ${selectIds
        .map((item) => {
          return item;
        })
        .join(" ## ")}`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#1DC071",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(fetchDeleteAccounts(selectIds));
        setPage(0);
        setSelected([]);
        toast.success("Xóa thành công!");
      }
    });
  };
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Data Account
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDeleteAll}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function AccountsManage() {
  const { dataAccount, inputSearch } = useSelector((state) => state.accounts);
  const { auth } = useSelector((state) => state.auth);
  const { newSlice } = useSliceString();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const dispatch = useDispatch();
  const { dataSearch } = useSearch();
  const [valueSearch, setValueSearch] = React.useState("");

  const rows = dataSearch(dataAccount.accounts, valueSearch);
  console.log("dataAccount.accounts", dataAccount.accounts);

  console.log("auth", auth);

  React.useEffect(() => {
    if (valueSearch.length > 0) {
      setPage(0);
    }
  }, [valueSearch]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map(
        (n) => n.id != "f9f4901d-9fc9-4979-b0cc-b474b5c27d16" && n.id
      );
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // const visibleRows = React.useMemo(
  //   () =>
  //     stableSort(rows, getComparator(order, orderBy)).slice(
  //       page * rowsPerPage,
  //       page * rowsPerPage + rowsPerPage
  //     ),
  //   [order, orderBy, page, rowsPerPage]
  // );
  const visibleRows = stableSort(rows, getComparator(order, orderBy)).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        p: 2,
        borderRadius: 2,
      }}
    >
      <div className="flex items-center gap-x-10 justify-between">
        {/* <BasicModal variant="contained" color="info"></BasicModal> */}
        <ModalAccounts></ModalAccounts>
        {/* <button className="btn bg-stone-400 " onClick={handlePageDelete}>
          Delete test
        </button> */}
        <SearchData
          label="Search email, department, position..."
          setValueSearch={setValueSearch}
        ></SearchData>
      </div>

      <Paper sx={{ my: 2 }}>
        <EnhancedTableToolbar
          selectIds={selected}
          dispatch={dispatch}
          // handlePageRezo={handlePageRezo}
          numSelected={selected.length - 1}
          setSelected={setSelected}
          setPage={setPage}
          // fetchListData={fetchListData}
        />
        <TableContainer>
          <Table
            // sx={{ width: "100%" }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    // aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    // selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <div
                        className={`${
                          row.email == "adminTest1122@gmail.com" ? "hidden" : ""
                        }`}
                      >
                        <Checkbox
                          color="primary"
                          onClick={(event) => handleClick(event, row.id)}
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="left">
                      <img
                        src={row.avatar}
                        alt=""
                        className="h-16 w-16 rounded"
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.email}
                    </TableCell>
                    <TableCell align="left">
                      {row.gender == "male" ? "Nam" : "Nữ"}
                    </TableCell>
                    <TableCell align="left">{row.fullname}</TableCell>
                    <TableCell align="left">{row.department}</TableCell>
                    <TableCell align="left">{row.position}</TableCell>
                    <TableCell align="left">{row.createdAt}</TableCell>

                    <TableCell align="left">
                      {auth[0]?.position == "Dev" && (
                        <Stack direction="row" spacing={2}>
                          <BasicModal
                            variant="outlined"
                            className="btn bg-primary h-8 w-8 text-white"
                            color="primary"
                            textButton={
                              <AssignmentIndIcon
                                color="white"
                                fontSize="small"
                              />
                            }
                            data={row}
                            header="id: "
                            hideBtnClose={false}
                          >
                            <Cards data={row}>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {row.email}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Username: {row.username} <br />
                                Fullname: {row.fullname} <br />
                                Department: {row.department} <br />
                                Position: {row.position} <br />
                                {row.createdate}
                              </Typography>
                            </Cards>
                          </BasicModal>
                          <ModalAccounts
                            data={row}
                            textBtn={
                              <BorderColorIcon color="white" fontSize="small" />
                            }
                          ></ModalAccounts>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {dataAccount.accounts.length == 0 && (
                <TableRow>
                  <TableCell colSpan={10}>
                    <Box sx={{ width: "100%" }}>
                      <Skeleton sx={{ height: "50px" }} />
                      <Skeleton sx={{ height: "50px" }} animation="wave" />
                      <Skeleton sx={{ height: "50px" }} animation={false} />
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={10} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
