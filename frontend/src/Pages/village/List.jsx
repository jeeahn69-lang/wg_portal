import MainLayout from "../../layouts/MainLayout";

export default function VillageList({ villages }) {
  return (
    <MainLayout>
      <h1>마을 목록</h1>

      <table className="w-full bg-white shadow">
        <thead>
          <tr>
            <th>이름</th>
            <th>주소</th>
            <th>인구</th>
          </tr>
        </thead>

        <tbody>
          {villages.map(v => (
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>{v.address}</td>
              <td>{v.population}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainLayout>
  );
}