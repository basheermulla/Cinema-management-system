import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// internal imports
import useConfig from 'hooks/useConfig';
import SkeletonTotalGrowthBarChart from 'components/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'components/cards/MainCard';
import { gridSpacing } from 'utils/constant-theme';

// chart data
import { chartYearData } from './chart-data/total-subscriptions-bar-chart';

const status = [
    {
        value: 'month',
        label: 'This Month [ Optional extension in the future ]'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

const TotalSubscriptionBarChart = ({ isLoading, yearlySubscriptionsData }) => {
    const [value, setValue] = useState('year');
    const [total, setTotal] = useState(0);

    const theme = useTheme();
    const { navType } = useConfig();

    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;

    // Setting data to get interactive visualizations for our chart using a modern JavaScript charting library [apexcharts]
    useEffect(() => {
        const newChartData = {
            ...chartYearData.options,
            colors: [primaryDark, primary200, secondaryMain, secondaryLight],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary]
                    }
                }
            },
            grid: {
                borderColor: navType === 'dark' ? darkLight + 20 : grey200
            },
            tooltip: {
                theme: navType === 'dark' ? 'dark' : 'light'
            },
            legend: {
                labels: {
                    colors: grey500
                }
            }
        };

        // do not load chart when loading
        if (!isLoading) {
            ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
        }
    }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500]);

    // Setting data that we recived from mongoDB in the series chart data - by year as a default configeration
    useEffect(() => {
        const data = yearlySubscriptionsData?.map((month) => month.total);
        const total_data = data?.reduce((a, b) => a + b, 0);
        setTotal(total_data);

        const series_Subscription_Data = chartYearData.series[0].data.map((value, index) => {
            const isMonthData = yearlySubscriptionsData?.find((mon) => (index + 1) === mon.month);
            return isMonthData ? isMonthData.total : 0;
        });

        chartYearData.series[0].data = series_Subscription_Data
    }, []);

    const handleChartShowData = (event) => {
        // Optional extension in the future
        if (event === 'month') {
            // Setting this month chart data
        } else {
            // Setting this year chart data
        }
    }

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Total Yearly Subscriptions</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3">{total}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="standard-select-currency"
                                        select
                                        value={value}
                                        onChange={(e) => handleChartShowData(e.target.value)}
                                    >
                                        {status.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ '& .apexcharts-legend-text': { marginLeft: 'initial' }, maxHeight: 550, minHeight: 550 }}>
                            <Chart {...chartYearData} />
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalSubscriptionBarChart.propTypes = {
    isLoading: PropTypes.bool,
    yearlySubscriptionsData: PropTypes.array
};

export default TotalSubscriptionBarChart;