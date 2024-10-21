import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { sortEndings, transformDataIntoFormData } from "../../utils";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLanguage } from "../lang/LanguageProvider";
import { useDeleteEnding, useDuplicateEnding } from "../../hooks/ending";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // Added useLocation
import { CustomEndingModel, DefaultEndingModel } from "../../types";
import EditEndings from "../Dialog/survey/edit/endings/EditEndings";

const EndingsContainer: React.FC<{
  setOpenEndingsPage: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpenEndingsPage }) => {
  const endings = useSelector((state: RootState) => state.endings);
  const { workspaceId, surveyId } = useParams();
  const location = useLocation(); // Use location from react-router-dom
  const { t, getCurrentLanguage, getCurrentLanguageTranslations } =
    useLanguage();
  const { handleDeleteEnding } = useDeleteEnding();
  const { handleDuplicateEnding } = useDuplicateEnding();

  const [menuOpen, setMenuOpen] = useState<Record<number, boolean>>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const [currentEnding, setCurrentEnding] = useState<
    CustomEndingModel | DefaultEndingModel | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();

  const allEndings = useMemo(
    () => sortEndings(endings.defaultEndings, endings.customEndings),
    [endings.defaultEndings, endings.customEndings]
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(event.target as Node)
    ) {
      setMenuOpen({});
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const toggleMenu = (id: number) => {
    setMenuOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = (endingId: number, type: string) => {
    try {
      const formData = new FormData();
      transformDataIntoFormData({ workspaceId, surveyId, type }, formData);
      handleDeleteEnding({
        endingId,
        ending: formData,
        getCurrentLanguageTranslations,
        currentLang: getCurrentLanguage(),
      });
      toggleMenu(endingId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDuplicate = (endingId: number, type: string) => {
    try {
      const formData = new FormData();
      transformDataIntoFormData({ workspaceId, surveyId, type }, formData);
      handleDuplicateEnding({
        endingId,
        ending: formData,
        getCurrentLanguageTranslations,
        currentLang: getCurrentLanguage(),
      });
      toggleMenu(endingId);
    } catch (error) {
      console.error(error);
    }
  };

  const onClose = () => {
    console.log("onClose");
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("type");
    searchParams.delete("id");

    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });

    setIsDialogOpen(false);
    setCurrentEnding(null);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (type === "ending" && id) {
      const endingToEdit = allEndings.find((q) => q.id === Number(id));
      if (endingToEdit) {
        setCurrentEnding(endingToEdit);
        setIsDialogOpen(true);
      }
    }
  }, [location, allEndings]);

  return (
    <>
      <div className="flex flex-col gap-2 w-full items-start">
        {allEndings.length > 0 ? (
          allEndings.map((ending) => (
            <div
              key={ending.id}
              className="relative flex w-full items-center transition-all hover:bg-[#303033] hover:text-white rounded-lg py-1 px-3"
              onClick={() =>
                navigate(
                  `/survey/${workspaceId}/${surveyId}/edit?type=ending&id=${ending.id}`
                )
              }
            >
              <div className="flex justify-start items-center gap-2 w-full cursor-pointer">
                <div className="flex survey_builder_icon">
                  <img
                    src="/assets/icons/endings.svg"
                    alt="endings"
                    className="w-[30px]"
                  />
                </div>
                {ending.defaultEnding && (
                  <span className="main_text rounded-lg bg-[#272626] border border-[#42484b] px-2">
                    Default
                  </span>
                )}
                <p
                  className="text-white font-semibold"
                  dangerouslySetInnerHTML={{ __html: ending.label ?? "" }}
                />
              </div>
              <button
                className="flex justify-center items-center border w-[50px] h-[30px] border-[#85808025] rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu(ending.id);
                }}
                ref={toggleButtonRef}
                aria-expanded={!!menuOpen[ending.id]}
                aria-controls={`menu-${ending.id}`}
              >
                <img
                  src="/assets/icons/dots.svg"
                  alt="menu"
                  className="w-[50px] h-[30px]"
                />
              </button>
              {menuOpen[ending.id] && (
                <div
                  id={`menu-${ending.id}`}
                  ref={menuRef}
                  className="flex flex-col text-left right-0 text-sm absolute top-10 bg-[#0e0e0e] p-2 rounded-md shadow-md z-10"
                >
                  <span
                    className="survey_card_buttons"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(ending.id, ending.type);
                    }}
                  >
                    {t("duplicate")}
                  </span>
                  <span
                    className="survey_card_buttons text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(ending.id, ending.type);
                    }}
                  >
                    {t("delete")}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div
            className="welcome_page_style"
            onClick={() => setOpenEndingsPage(true)}
          >
            <img src="/assets/icons/plus.svg" alt="plus" className="w-[20px]" />
            <p>{t("endings")}</p>
          </div>
        )}
      </div>
      {isDialogOpen && currentEnding && (
        <EditEndings
          ending={currentEnding}
          isOpen={isDialogOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default EndingsContainer;