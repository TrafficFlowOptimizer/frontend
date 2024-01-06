# TrafficFlowOptimizer - moduł Frontend

## Opis
Moduł jest częścią webową aplikacji.\
Został zaprojektowany z myślą o jak największej przejrzystości i prostocie użytkowania. Dodatkowo każdy etap procesu modelowania skrzyżowania, dodawania nagrania, zlecania optymalizacji oraz podglądu wyników opatrzony jest krótką instrukcją postępowania.\
Poniżej przedstawiono generalny schemat użytkowania modułu dostępny dla klienta.

<img width="1747" alt="flow_szczegolowy" src="https://github.com/TrafficFlowOptimizer/frontend/assets/92650724/8283a9d6-acf6-463e-b53d-cc30b729ed1f">


## Najważniejsze elementy
Oprócz autentykacji i autoryzacji głównymi elementami modułu są odpowiednio:
* **DrawingTool** - autorskie narzędzie do tworzenia modeli skrzyżowań. Pozwala w realistyczny sposób odtworzyć dowolne skrzyżowanie. Zostawia klientowi duże pole manewru umożliwiając m.in. wprowadzenie hipotetycznych zmian w wybranym przejeździe, czy stworzenie zupełnie nowego układu ulic. Poniżej zaprezentowano szczegółowy schemat kolejnych etapów tworzenia skrzyżowania za pomoca narzędzia:

![drawing-tool_flow](https://github.com/TrafficFlowOptimizer/frontend/assets/92650724/09db9ecf-76f3-4471-aabd-03dfd2a672ee)

* **Wyznaczanie pasów na klatce nagrania za pomocą tzw. DetectionRectangles** - element niezbędny dla modułu Analizatora do poprawnego przetwarzania dostarczonych nagrań. Polega na wyznaczeniu obszarów konkretnych pasów widocznych na nagraniu i przyporządkowaniu ich do konkretnych przejazdów.
*  **Zlecanie optymalizacji i podgląd wyników** - wysłanie zlecenia optymalizacji za pomocą żądania HTTP oraz podgląd uzyskanych w ten sposób rezultatów w postaci danych opisowych i symulacji.

## Wykorzystane zewnętrzne biblioteki
Moduł oparto na **frameworku React** i **języku TypeScript**.\
Oprócz funkcjonalności zapewnianych przez ww. narzędzia wykorzystano również kilka zewnętrznych bibliotek oraz narzędzi:
* **Font Awesome**, **MaterialUI** oraz **styled-components** w celu wzbogacenia strony wizualnej projektu
* **Eslint** oraz **Prettier** formatujące kod i pilnujące spójności stylu, oraz zachowywania zasad pisania w TypeScriptcie
* **Axios**, by uprościć korzystanie z żądań HTTP. Właśnie za ich pomocą, w oparciu o styl architektoniczny REST moduł komunikuje się z Backendem (częścią serwerową)
* **Google Maps API** wykorzystywane w autorskim narzędziu DrawingTool do tworzenia modeli skrzyżowań

## Jak uruchomić moduł, wykorzystanie npm

Jeśli uruchamiamy aplikację po raz pierwszy należy jako krok zerowy użyć komendy `npm install`.\
Komenda `npm start` uruchamia aplikację w trybie developerskim.\
Aplikację można także uruchomić w innych trybach opisanych w dokumentacji frameworka.\
Otwórz [http://localhost:3000](http://localhost:3000) aby zobaczyć klienta w przeglądarce.

**!UWAGA!**\
Aby moduł działał w pełni poprawnie powinien w głównym katalogu zawierać plik **.env**, zawierający następujące informacje:
* Klucz API do Map Google umożliwiający krok pierwszy tworzenia skrzyżowania &rarr; **REACT_APP_GOOGLE_MAPS_API_KEY**=\<klucz>
* Ustalona z góry nazwa administratora systemu &rarr; **REACT_APP_ADMIN_USERNAME**=\<ustalona nazwa administratora>

Plik ten ze względów bezpieczeństwa nie jest udostępniany w repozytorium. Domyślnie zakłada się, że zostałby stworzony specjalnie dla klienta przed oddaniem w jego ręce produktu, analogicznie postępowano by z kluczem dostępu do API map Google.


## Dokumentacja React'a

* [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
* [React documentation](https://reactjs.org/)
