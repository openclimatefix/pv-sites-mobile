import Head from 'next/head';

const Form = () => {
  return (
    <>
      <Head>
        <title>Panel Details | Open Climate Fix</title>
        <meta name="description" content="Generated by Neha and Ashay" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-white dark:bg-black flex flex-col items-center justify-start px-10 min-h-screen">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const data = new FormData(e.currentTarget);

              const solarPanelDirection = data.get(
                'solarPanelDirection'
              ) as string;
              const solarPanelAngelTilt = data.get(
                'solarPanelAngelTilt'
              ) as string;
              const solarPanelCapacity = data.get(
                'solarPanelCapacity'
              ) as string;

              console.log(
                `Direction: ${solarPanelDirection}, Angel Tilt: ${solarPanelAngelTilt}, Capacity: ${solarPanelCapacity}`
              );
            } catch (e) {
              console.log(`onSubmit(): ${e}`);
            }
          }}
        >
          <div>
            <h1 className="font-bold text-4xl mt-20 dark:text-ocf-gray">
              Panel Details
            </h1>
          </div>
          <div className="my-8">
            <h2 className="font-medium text-lg dark:text-ocf-gray">
              Solar panel direction
            </h2>
            <p className="text-ocf-gray-900 text-xs mt-1 dark:text-ocf-gray-800">
              (0º = North, 90º = East, 180º = South, 270º = West)
            </p>
            <input
              required
              name="solarPanelDirection"
              type="number"
              placeholder="170º"
              className="mt-3 text-lg text-center 
              bg-gray-50 border border-gray-300 hover:ring-ocf-yellow hover:border-ocf-yellow  text-gray-900 rounded-lg  block w-20 h-14 p-2.5               
              dark:bg-ocf-gray-800
              dark:border-ocf-gray-800
              dark:placeholder-ocf-gray-900 dark:text-ocf-gray"
            />
            <p className="text-ocf-gray-900 text-xs mt-1 underline dark:text-ocf-gray-800">
              I don&apos;t know
            </p>
          </div>

          <div className="my-8">
            <h2 className="font-medium text-lg dark:text-ocf-gray">
              Solar panel angle tilt
            </h2>
            <p className="text-ocf-gray-900 text-xs mt-1 dark:text-ocf-gray-800">
              (Degrees above the horizontal)
            </p>
            <input
              required
              name="solarPanelAngelTilt"
              type="number"
              placeholder="30º"
              className="mt-3 text-lg text-center 
              bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-20 h-14 p-2.5 hover:ring-ocf-yellow hover:border-ocf-yellow  dark:bg-ocf-gray-800
              dark:border-ocf-gray-800
              dark:placeholder-ocf-gray-900 dark:text-ocf-gray "
            />
          </div>

          <div className="my-8">
            <div className="flex flex-row justify-start items-center w-full">
              <h2 className="font-medium text-lg dark:text-ocf-gray">
                Solar panel capacity
              </h2>
              <p className="text-ocf-gray-900 text-xs mx-1 dark:text-ocf-gray-800">
                (optional)
              </p>
            </div>
            <input
              name="solarPanelCapacity"
              type="number"
              placeholder="3000 W"
              className="mt-3 text-lg text-center bg-gray-50 border border-gray-300 text-gray-900 rounded-lg hover:ring-ocf-yellow hover:border-ocf-yellow block w-28 h-14 p-2.5 dark:bg-ocf-gray-800
              dark:border-ocf-gray-800
              dark:placeholder-ocf-gray-900 dark:text-ocf-gray"
            />
          </div>

          <div className="flex justify-center items-center w-full mt-24">
            <button className="bg-ocf-yellow dark:bg-ocf-yellow shadow h-14 w-40 text-center rounded-md font-bold text-xl">
              NEXT
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default Form;
