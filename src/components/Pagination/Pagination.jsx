import Pagination from "react-bootstrap/Pagination";

export default function PaginationComponent({ totalPages, currentPage, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-4" style={{ justifyContent: "center" }}>
      {[...Array(totalPages)].map((_, idx) => (
        <Pagination.Item
          key={idx + 1}
          active={idx + 1 === currentPage}
          onClick={() => onPageChange(idx + 1)}
        >
          {idx + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );
}
