
type BarisProps = {
  readonly title: string;
  readonly content: string;
};

function Baris({
  title = "Placeholder Title",
  content = "Lorem Ipsum dolor sit amet",
}: BarisProps) {
  return (
    <div>
        <p className="fs-5 fw-semibold m-0">{title}</p>
        <p>{content}</p>
    </div>
  );
}

export default Baris;
